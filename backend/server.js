const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { db, initSchema } = require('./db');
const { CropTrie } = require('./services/trie');
const { matchRequirement } = require('./services/matching');
const { calculateNetReturn } = require('./services/netReturn');

const trie = new CropTrie();
const sessions = new Map();
const ROOT = path.join(__dirname, '..');
const REACT_DIR = path.join(ROOT, 'react-lab');
const PORT = process.env.PORT || 3000;

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; if (body.length > 1e6) reject(new Error('Request too large')); });
    req.on('end', () => {
      if (!body) return resolve({});
      try { resolve(JSON.parse(body)); } catch (err) { resolve({}); }
    });
  });
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(String(password)).digest('hex');
}

function buildTrie() {
  const rows = db.prepare('SELECT id, name FROM crops').all();
  trie.root = { children: new Map(), end: false, aliases: [] };
  for (const row of rows) trie.insert(row.name, row.id);
}

function getMime(file) {
  const ext = path.extname(file).toLowerCase();
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };
  return map[ext] || 'application/octet-stream';
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  let safePath = urlPath === '/' ? '/index.html' : urlPath;
  const filePath = path.join(REACT_DIR, safePath.replace(/^\//, ''));
  if (!filePath.startsWith(REACT_DIR)) {
    return sendJson(res, 403, { success: false, error: 'Forbidden' });
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (urlPath === '/') {
        return fs.readFile(path.join(REACT_DIR, 'index.html'), (readErr, html) => {
          if (readErr) return sendJson(res, 404, { success: false, error: 'Not found' });
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(html);
        });
      }
      return sendJson(res, 404, { success: false, error: 'Not found' });
    }
    res.writeHead(200, { 'Content-Type': getMime(filePath) });
    res.end(data);
  });
}

initSchema();
buildTrie();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (pathname.startsWith('/api/')) {
    if (pathname === '/api/health') {
      return sendJson(res, 200, { ok: true, message: 'RaithuSetu backend healthy' });
    }

    if (pathname === '/api/auth/register') {
      const body = await parseBody(req);
      const { name, username, password, role } = body || {};
      if (!name || !username || !password || !role) return sendJson(res, 400, { success: false, error: 'Missing register fields' });
      const row = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
      if (row) return sendJson(res, 409, { success: false, error: 'Username already exists' });
      db.prepare('INSERT INTO users (name, role, username, password_hash) VALUES (?, ?, ?, ?)').run(name, role, username, hashPassword(password));
      return sendJson(res, 201, { success: true, message: 'Registered' });
    }

    if (pathname === '/api/auth/login') {
      const body = await parseBody(req);
      const { username, password } = body || {};
      const user = db.prepare('SELECT id, username, role, password_hash FROM users WHERE username = ?').get(username);
      if (!user) return sendJson(res, 404, { success: false, error: 'User not found' });
      if (user.password_hash !== hashPassword(password)) return sendJson(res, 401, { success: false, error: 'Invalid password' });
      const token = crypto.randomBytes(16).toString('hex');
      sessions.set(token, { userId: user.id, role: user.role, username: user.username });
      return sendJson(res, 200, { success: true, token, user: { id: user.id, username: user.username, role: user.role } });
    }

    if (pathname === '/api/crops' && req.method === 'GET') {
      const rows = db.prepare('SELECT * FROM crops ORDER BY name').all();
      return sendJson(res, 200, { success: true, data: rows });
    }

    if (pathname === '/api/crops/search') {
      const prefix = url.searchParams.get('prefix') || '';
      const rows = db.prepare('SELECT c.id, c.name, c.unit FROM crops c WHERE lower(c.name) LIKE ? ORDER BY c.name LIMIT 10').all(`${prefix.toLowerCase()}%`);
      const trieResults = trie.search(prefix);
      return sendJson(res, 200, { success: true, data: rows.length ? rows : trieResults.map((item) => ({ id: item.aliases[0] || null, name: item.label, unit: 'kg' })) });
    }

    if (pathname === '/api/crops' && req.method === 'POST') {
      const body = await parseBody(req);
      const { name, unit } = body || {};
      if (!name || !unit) return sendJson(res, 400, { success: false, error: 'Crop name and unit required' });
      const result = db.prepare('INSERT INTO crops (name, unit) VALUES (?, ?)').run(String(name).trim().toLowerCase(), unit);
      buildTrie();
      return sendJson(res, 201, { success: true, id: result.lastInsertRowid, name: String(name).trim().toLowerCase(), unit });
    }

    if (pathname === '/api/listings' && req.method === 'GET') {
      const rows = db.prepare('SELECT * FROM listings ORDER BY id').all();
      return sendJson(res, 200, { success: true, data: rows });
    }

    if (pathname === '/api/listings' && req.method === 'POST') {
      const body = await parseBody(req);
      const { farmer_id, crop_name, unit, quantity, price, grade, harvest_date } = body || {};
      if (!farmer_id || !crop_name || !unit || !quantity || !price || !grade || !harvest_date) {
        return sendJson(res, 400, { success: false, error: 'Missing listing fields' });
      }
      const crop = db.prepare('SELECT id FROM crops WHERE lower(name) = lower(?)').get(crop_name);
      if (!crop) return sendJson(res, 404, { success: false, error: 'Crop not found' });
      const result = db.prepare('INSERT INTO listings (farmer_id, crop_id, crop_name, unit, quantity, remaining_quantity, price, grade, harvest_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .run(farmer_id, crop.id, crop_name, unit, quantity, quantity, price, grade, harvest_date, 'ACTIVE');
      return sendJson(res, 201, { success: true, id: result.lastInsertRowid, message: 'Listing added' });
    }

    if (pathname === '/api/buyer-requirements' && req.method === 'GET') {
      const rows = db.prepare('SELECT * FROM buyer_requirements ORDER BY id DESC').all();
      return sendJson(res, 200, { success: true, data: rows });
    }

    if (pathname === '/api/buyer-requirements' && req.method === 'POST') {
      const body = await parseBody(req);
      const { buyer_id, crop_name, unit, quantity, min_grade, max_price, delivery_date } = body || {};
      if (!buyer_id || !crop_name || !unit || !quantity || !min_grade || !delivery_date) {
        return sendJson(res, 400, { success: false, error: 'Missing requirement fields' });
      }
      const result = db.prepare('INSERT INTO buyer_requirements (buyer_id, crop_name, unit, quantity, min_grade, max_price, delivery_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .run(buyer_id, crop_name, unit, quantity, min_grade, max_price || null, delivery_date, 'OPEN');
      return sendJson(res, 201, { success: true, id: result.lastInsertRowid });
    }

    if (pathname === '/api/lots/match') {
      const body = await parseBody(req);
      const rows = db.prepare('SELECT * FROM listings ORDER BY id').all();
      const result = matchRequirement(body || {}, rows);
      return sendJson(res, 200, { success: true, data: result });
    }

    if (pathname.startsWith('/api/lots/') && pathname.endsWith('/net-return')) {
      const lotId = Number(pathname.split('/')[2]);
      const rows = db.prepare('SELECT * FROM lot_contributions WHERE lot_id = ?').all(lotId);
      return sendJson(res, 200, { success: true, data: rows });
    }

    return sendJson(res, 404, { success: false, error: 'API route not found' });
  }

  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`RaithuSetu backend listening on http://localhost:${PORT}`);
});
