INSERT INTO users (id, name, role, username, password_hash) VALUES
  (1, 'Farmer A', 'farmer', 'farmer1', 'demohash'),
  (2, 'Farmer B', 'farmer', 'farmer2', 'demohash'),
  (3, 'Farmer C', 'farmer', 'farmer3', 'demohash'),
  (4, 'Farmer D', 'farmer', 'farmer4', 'demohash'),
  (5, 'Farmer E', 'farmer', 'farmer5', 'demohash'),
  (6, 'Buyer One', 'buyer', 'buyer1', 'demohash'),
  (7, 'Admin One', 'admin', 'admin1', 'demohash');

INSERT INTO farmers (id, user_id, district) VALUES
  (1, 1, 'Nellore'),
  (2, 2, 'Guntur'),
  (3, 3, 'Anantapur'),
  (4, 4, 'Kadapa'),
  (5, 5, 'Prakasam');

INSERT INTO buyers (id, user_id, company_name) VALUES
  (1, 6, 'Demo Fresh Market');

INSERT INTO crops (id, name, unit, status) VALUES
  (1, 'tomato', 'kg', 'ACTIVE'),
  (2, 'onion', 'kg', 'ACTIVE'),
  (3, 'potato', 'kg', 'ACTIVE');

INSERT INTO crop_aliases (id, crop_id, alias) VALUES
  (1, 1, 'tomato'),
  (2, 1, 'tamato');

INSERT INTO listings (id, farmer_id, crop_id, quantity, remaining_quantity, price, grade, harvest_date, status) VALUES
  (1, 1, 1, 100, 100, 24, 4, '2026-11-20', 'ACTIVE'),
  (2, 2, 1, 150, 150, 25, 4, '2026-11-21', 'ACTIVE'),
  (3, 3, 1, 200, 200, 23, 5, '2026-11-22', 'ACTIVE'),
  (4, 4, 1, 250, 250, 22, 4, '2026-11-23', 'ACTIVE'),
  (5, 5, 1, 300, 300, 21, 5, '2026-11-24', 'ACTIVE');

INSERT INTO requirements (id, buyer_id, crop_id, quantity, min_grade, max_price, delivery_date, status) VALUES
  (1, 1, 1, 700, 4, 30.0, '2026-11-30', 'OPEN');

INSERT INTO lots (id, buyer_id, crop_id, quantity, status) VALUES
  (1, 1, 1, 700, 'PROPOSED');

INSERT INTO lot_contributions (id, lot_id, listing_id, quantity, unit_price) VALUES
  (1, 1, 1, 100, 24),
  (2, 1, 2, 150, 25),
  (3, 1, 3, 200, 23),
  (4, 1, 4, 250, 22);

INSERT INTO lot_status_history (id, lot_id, status, note) VALUES
  (1, 1, 'PROPOSED', 'Demo lot created');

INSERT INTO transport_quotes (id, lot_id, vendor, cost) VALUES
  (1, 1, 'DemoCarrier', 1750.00);
