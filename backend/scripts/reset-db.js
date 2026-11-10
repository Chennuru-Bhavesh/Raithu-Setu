const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'data', 'raithusetu.db');
if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
const { initSchema } = require('../db');
initSchema();
console.log('Database reset complete.');
