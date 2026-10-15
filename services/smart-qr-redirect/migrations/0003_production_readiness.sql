ALTER TABLE smart_qr_units
  ADD COLUMN production_status TEXT NOT NULL DEFAULT 'in_production'
    CHECK (production_status IN ('in_production', 'ready'));

ALTER TABLE smart_qr_units
  ADD COLUMN production_ready_at TEXT;

-- Units created before this workflow was introduced are already operational.
UPDATE smart_qr_units
SET
  production_status = 'ready',
  production_ready_at = CURRENT_TIMESTAMP;

CREATE TRIGGER smart_qr_units_require_ready_before_activation_insert
BEFORE INSERT ON smart_qr_units
WHEN NEW.status = 'active' AND NEW.production_status != 'ready'
BEGIN
  SELECT RAISE(ABORT, 'Smart QR must be ready before scans can be enabled');
END;

CREATE TRIGGER smart_qr_units_require_ready_before_activation_update
BEFORE UPDATE OF status, production_status ON smart_qr_units
WHEN NEW.status = 'active' AND NEW.production_status != 'ready'
BEGIN
  SELECT RAISE(ABORT, 'Smart QR must be ready before scans can be enabled');
END;
