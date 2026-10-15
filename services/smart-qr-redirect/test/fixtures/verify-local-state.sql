SELECT
  unit_number,
  public_token,
  destination_url,
  status
FROM smart_qr_units
WHERE public_token = 'TEST7mP4x9Q2';

SELECT
  previous_url,
  destination_url,
  changed_by
FROM destination_history
WHERE smart_qr_unit_id = 'unit_local_active'
ORDER BY id DESC
LIMIT 1;

