ALTER TABLE smart_qr_units
  ADD COLUMN display_name TEXT;

ALTER TABLE smart_qr_units
  ADD COLUMN plate_size_mm INTEGER NOT NULL DEFAULT 90
    CHECK (plate_size_mm IN (60, 90, 120));

ALTER TABLE smart_qr_units
  ADD COLUMN manufacturing_status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (
      manufacturing_status IN (
        'not_started',
        'generating',
        'ready',
        'failed'
      )
    );

CREATE TABLE smart_qr_unit_numbers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO smart_qr_unit_numbers (id, created_at)
SELECT
  CAST(SUBSTR(unit_number, 4) AS INTEGER),
  created_at
FROM smart_qr_units;

CREATE TABLE manufacturing_asset_versions (
  id TEXT PRIMARY KEY,
  smart_qr_unit_id TEXT NOT NULL
    REFERENCES smart_qr_units(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  generator_version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'generating'
    CHECK (status IN ('generating', 'ready', 'failed')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT,
  UNIQUE (smart_qr_unit_id, version)
);

CREATE INDEX manufacturing_asset_versions_unit_idx
  ON manufacturing_asset_versions (smart_qr_unit_id, version DESC);

CREATE TABLE manufacturing_assets (
  id TEXT PRIMARY KEY,
  asset_version_id TEXT NOT NULL
    REFERENCES manufacturing_asset_versions(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL
    CHECK (asset_type IN ('svg', 'png', 'stl', 'notes', 'package')),
  r2_key TEXT NOT NULL UNIQUE,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  byte_size INTEGER NOT NULL CHECK (byte_size >= 0),
  sha256 TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (asset_version_id, asset_type)
);

CREATE INDEX manufacturing_assets_version_idx
  ON manufacturing_assets (asset_version_id);

