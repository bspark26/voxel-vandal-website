INSERT INTO organizations (
  id,
  name,
  account_status
)
VALUES (
  'org_local_voxel_vandal',
  'Voxel Vandal Local Test',
  'active'
);

INSERT INTO smart_qr_units (
  id,
  unit_number,
  public_token,
  organization_id,
  destination_url,
  status,
  activated_at
)
VALUES
  (
    'unit_local_active',
    'VV-00001',
    'TEST7mP4x9Q2',
    'org_local_voxel_vandal',
    'https://voxelvandal.com/smart-qr/',
    'active',
    CURRENT_TIMESTAMP
  ),
  (
    'unit_local_paused',
    'VV-00002',
    'PAUSE7mP4x92',
    'org_local_voxel_vandal',
    'https://voxelvandal.com/',
    'paused',
    CURRENT_TIMESTAMP
  ),
  (
    'unit_local_retired',
    'VV-00003',
    'R3TQR7mP4x92',
    'org_local_voxel_vandal',
    'https://voxelvandal.com/',
    'retired',
    CURRENT_TIMESTAMP
  );
