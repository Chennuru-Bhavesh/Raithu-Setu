const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dbDir = path.join(__dirname, 'data');
const dbPath = path.join(dbDir, 'raithusetu.db');
fs.mkdirSync(dbDir, { recursive: true });
const db = new DatabaseSync(dbPath);

db.exec('PRAGMA foreign_keys = ON;');

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS crops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      unit TEXT NOT NULL CHECK (unit IN ('kg','box')),
      status TEXT NOT NULL DEFAULT 'ACTIVE'
    );

    CREATE TABLE IF NOT EXISTS crop_aliases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      crop_id INTEGER NOT NULL,
      alias TEXT NOT NULL,
      UNIQUE(crop_id, alias),
      FOREIGN KEY(crop_id) REFERENCES crops(id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('farmer', 'buyer', 'admin')),
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER NOT NULL,
      crop_id INTEGER NOT NULL,
      crop_name TEXT NOT NULL,
      unit TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      remaining_quantity INTEGER NOT NULL CHECK (remaining_quantity >= 0),
      price REAL NOT NULL CHECK (price >= 0),
      grade INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 5),
      harvest_date TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'PARTIALLY_COMMITTED', 'INACTIVE')),
      FOREIGN KEY(farmer_id) REFERENCES users(id),
      FOREIGN KEY(crop_id) REFERENCES crops(id)
    );

    CREATE TABLE IF NOT EXISTS buyer_requirements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      buyer_id INTEGER NOT NULL,
      crop_name TEXT NOT NULL,
      unit TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      min_grade INTEGER NOT NULL CHECK (min_grade BETWEEN 1 AND 5),
      max_price REAL,
      delivery_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'OPEN',
      FOREIGN KEY(buyer_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS lots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      buyer_id INTEGER NOT NULL,
      crop_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('DRAFT', 'PROPOSED', 'CONFIRMED', 'CANCELLED')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(buyer_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS lot_contributions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lot_id INTEGER NOT NULL,
      listing_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      unit_price REAL NOT NULL,
      FOREIGN KEY(lot_id) REFERENCES lots(id),
      FOREIGN KEY(listing_id) REFERENCES listings(id)
    );

    CREATE TABLE IF NOT EXISTS lot_status_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lot_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      note TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(lot_id) REFERENCES lots(id)
    );

    CREATE TABLE IF NOT EXISTS transport_quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lot_id INTEGER NOT NULL,
      vendor TEXT NOT NULL,
      cost REAL NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(lot_id) REFERENCES lots(id)
    );
  `);

  const crops = db.prepare('SELECT COUNT(*) AS c FROM crops').get();
  if (Number(crops.c) === 0) seedDemoData();
}

function seedDemoData() {
  const cropRows = [
    ['tomato', 'kg'],
    ['onion', 'kg'],
    ['potato', 'kg']
  ];
  for (const [name, unit] of cropRows) {
    db.prepare('INSERT INTO crops (name, unit) VALUES (?, ?)').run(name, unit);
  }

  const users = [
    ['Farmer A', 'farmer', 'farmer1', 'demohash'],
    ['Farmer B', 'farmer', 'farmer2', 'demohash'],
    ['Farmer C', 'farmer', 'farmer3', 'demohash'],
    ['Farmer D', 'farmer', 'farmer4', 'demohash'],
    ['Farmer E', 'farmer', 'farmer5', 'demohash'],
    ['Buyer One', 'buyer', 'buyer1', 'demohash'],
    ['Admin One', 'admin', 'admin1', 'demohash']
  ];
  for (const [name, role, username, pwd] of users) {
    db.prepare('INSERT INTO users (name, role, username, password_hash) VALUES (?, ?, ?, ?)').run(name, role, username, pwd);
  }

  const listings = [
    [1, 1, 'tomato', 'kg', 100, 100, 24, 4, '2026-11-20', 'ACTIVE'],
    [2, 1, 'tomato', 'kg', 150, 150, 25, 4, '2026-11-21', 'ACTIVE'],
    [3, 1, 'tomato', 'kg', 200, 200, 23, 5, '2026-11-22', 'ACTIVE'],
    [4, 1, 'tomato', 'kg', 250, 250, 22, 4, '2026-11-23', 'ACTIVE'],
    [5, 1, 'tomato', 'kg', 300, 300, 21, 5, '2026-11-24', 'ACTIVE']
  ];
  for (const row of listings) {
    db.prepare('INSERT INTO listings (farmer_id, crop_id, crop_name, unit, quantity, remaining_quantity, price, grade, harvest_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(...row);
  }

  db.prepare('INSERT INTO buyer_requirements (buyer_id, crop_name, unit, quantity, min_grade, max_price, delivery_date) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(6, 'tomato', 'kg', 700, 4, 30, '2026-11-30');
}

module.exports = { db, initSchema };
