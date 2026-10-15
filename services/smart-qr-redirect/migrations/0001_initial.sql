PRAGMA foreign_keys = ON;

CREATE TABLE organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  account_status TEXT NOT NULL DEFAULT 'trial'
    CHECK (account_status IN ('trial', 'active', 'past_due', 'inactive')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE smart_qr_units (
  id TEXT PRIMARY KEY,
  unit_number TEXT NOT NULL UNIQUE
    CHECK (unit_number GLOB 'VV-[0-9][0-9][0-9][0-9][0-9]'),
  public_token TEXT NOT NULL UNIQUE
    CHECK (length(public_token) = 12),
  organization_id TEXT REFERENCES organizations(id) ON DELETE SET NULL,
  destination_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'active', 'paused', 'retired')),
  generator_version TEXT NOT NULL DEFAULT '0.1.0',
  activated_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX smart_qr_units_organization_idx
  ON smart_qr_units (organization_id);

CREATE TABLE destination_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  smart_qr_unit_id TEXT NOT NULL
    REFERENCES smart_qr_units(id) ON DELETE CASCADE,
  previous_url TEXT,
  destination_url TEXT,
  changed_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX destination_history_unit_created_idx
  ON destination_history (smart_qr_unit_id, created_at DESC);

CREATE TRIGGER smart_qr_units_log_destination_change
AFTER UPDATE OF destination_url ON smart_qr_units
WHEN OLD.destination_url IS NOT NEW.destination_url
BEGIN
  INSERT INTO destination_history (
    smart_qr_unit_id,
    previous_url,
    destination_url,
    changed_by
  )
  VALUES (
    NEW.id,
    OLD.destination_url,
    NEW.destination_url,
    'system'
  );
END;

