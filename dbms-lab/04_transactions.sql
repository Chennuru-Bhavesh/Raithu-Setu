BEGIN IMMEDIATE;
UPDATE listings SET remaining_quantity = remaining_quantity - 100 WHERE id = 1;
UPDATE listings SET remaining_quantity = remaining_quantity - 150 WHERE id = 2;
INSERT INTO lot_status_history (lot_id, status, note) VALUES (1, 'CONFIRMED', 'Batch confirmed');
COMMIT;

-- Example rollback due to invalid constraint.
BEGIN IMMEDIATE;
UPDATE listings SET remaining_quantity = remaining_quantity - 1000 WHERE id = 1;
-- This would fail because remaining_quantity cannot be negative.
ROLLBACK;
