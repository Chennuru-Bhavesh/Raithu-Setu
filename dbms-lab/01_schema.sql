PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('farmer','buyer','admin')),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL
);

CREATE TABLE crops (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  unit TEXT NOT NULL CHECK (unit IN ('kg','box')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE'))
);

CREATE TABLE crop_aliases (
  id INTEGER PRIMARY KEY,
  crop_id INTEGER NOT NULL,
  alias TEXT NOT NULL,
  UNIQUE(crop_id, alias),
  FOREIGN KEY (crop_id) REFERENCES crops(id)
);

CREATE TABLE farmers (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  district TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE buyers (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE listings (
  id INTEGER PRIMARY KEY,
  farmer_id INTEGER NOT NULL,
  crop_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  remaining_quantity INTEGER NOT NULL CHECK (remaining_quantity >= 0),
  price REAL NOT NULL CHECK (price >= 0),
  grade INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 5),
  harvest_date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ACTIVE','PARTIALLY_COMMITTED','INACTIVE')),
  FOREIGN KEY (farmer_id) REFERENCES farmers(id),
  FOREIGN KEY (crop_id) REFERENCES crops(id)
);

CREATE TABLE requirements (
  id INTEGER PRIMARY KEY,
  buyer_id INTEGER NOT NULL,
  crop_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  min_grade INTEGER NOT NULL CHECK (min_grade BETWEEN 1 AND 5),
  max_price REAL,
  delivery_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','MATCHED','CANCELLED')),
  FOREIGN KEY (buyer_id) REFERENCES buyers(id),
  FOREIGN KEY (crop_id) REFERENCES crops(id)
);

CREATE TABLE lots (
  id INTEGER PRIMARY KEY,
  buyer_id INTEGER NOT NULL,
  crop_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  status TEXT NOT NULL CHECK (status IN ('DRAFT','PROPOSED','CONFIRMED','CANCELLED')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES buyers(id),
  FOREIGN KEY (crop_id) REFERENCES crops(id)
);

CREATE TABLE lot_contributions (
  id INTEGER PRIMARY KEY,
  lot_id INTEGER NOT NULL,
  listing_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price REAL NOT NULL CHECK (unit_price >= 0),
  FOREIGN KEY (lot_id) REFERENCES lots(id),
  FOREIGN KEY (listing_id) REFERENCES listings(id)
);

CREATE TABLE lot_status_history (
  id INTEGER PRIMARY KEY,
  lot_id INTEGER NOT NULL,
  status TEXT NOT NULL,
  note TEXT,
  event_time TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lot_id) REFERENCES lots(id)
);

CREATE TABLE transport_quotes (
  id INTEGER PRIMARY KEY,
  lot_id INTEGER NOT NULL,
  vendor TEXT NOT NULL,
  cost REAL NOT NULL CHECK (cost >= 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lot_id) REFERENCES lots(id)
);
