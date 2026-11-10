-- This should fail because quantity must be > 0.
INSERT INTO listings (id, farmer_id, crop_id, quantity, remaining_quantity, price, grade, harvest_date, status)
VALUES (99, 1, 1, 0, 0, 20, 4, '2026-11-25', 'ACTIVE');

-- This should fail because committed quantity exceeds available quantity.
INSERT INTO lot_contributions (id, lot_id, listing_id, quantity, unit_price)
VALUES (999, 1, 1, 500, 24);

-- This should fail because status is not allowed.
INSERT INTO lots (id, buyer_id, crop_id, quantity, status)
VALUES (2, 1, 1, 50, 'PENDING');
