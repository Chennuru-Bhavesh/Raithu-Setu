-- Query 1: Inner join between the five farmer listings and crops.
SELECT l.id, f.id AS farmer_id, c.name AS crop_name, l.quantity, l.price
FROM listings l
INNER JOIN farmers f ON f.id = l.farmer_id
INNER JOIN crops c ON c.id = l.crop_id
WHERE c.name = 'tomato';

-- Query 2: LEFT JOIN to show all farmers and their listing totals, even if a farmer has no listing.
SELECT u.name, COUNT(l.id) AS listing_count, COALESCE(SUM(l.quantity), 0) AS total_qty
FROM users u
LEFT JOIN farmers f ON f.user_id = u.id
LEFT JOIN listings l ON l.farmer_id = f.id
GROUP BY u.id, u.name
ORDER BY total_qty DESC;

-- Query 3: GROUP BY with HAVING to show only farmers with more than 200 kg available.
SELECT f.id, SUM(l.quantity) AS total_quantity
FROM listings l
JOIN farmers f ON f.id = l.farmer_id
GROUP BY f.id
HAVING SUM(l.quantity) > 200;

-- Query 4: Subquery to find the lowest-price tomato listing.
SELECT *
FROM listings
WHERE price = (SELECT MIN(price) FROM listings WHERE crop_id = 1);

-- Query 5: Window function ranks tomato listings by price within crop.
SELECT id, crop_id, price,
       RANK() OVER (PARTITION BY crop_id ORDER BY price ASC) AS price_rank
FROM listings;

-- Query 6: Create a view that summarizes lot totals.
CREATE VIEW v_lot_summary AS
SELECT l.id AS lot_id, c.name AS crop_name, SUM(lc.quantity) AS total_contributed,
       COUNT(lc.id) AS contributor_count
FROM lots l
JOIN crops c ON c.id = l.crop_id
LEFT JOIN lot_contributions lc ON lc.lot_id = l.id
GROUP BY l.id, c.name;

SELECT * FROM v_lot_summary;
