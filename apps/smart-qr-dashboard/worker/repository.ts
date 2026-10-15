import type { AssetRow, Env, UnitRow } from "./types";
import type { ProductionStatus } from "./types";
import { resolveScanStatus } from "./workflow";

const TOKEN_ALPHABET =
  "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function generateToken(length = 12): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(
    bytes,
    (byte) => TOKEN_ALPHABET[byte % TOKEN_ALPHABET.length],
  ).join("");
}

function unitNumber(sequence: number): string {
  return `VV-${sequence.toString().padStart(5, "0")}`;
}

export async function listOrganizations(env: Env) {
  const result = await env.DB.prepare(
    `SELECT
       o.id,
       o.name,
       o.account_status,
       o.created_at,
       COUNT(u.id) AS unit_count
     FROM organizations o
     LEFT JOIN smart_qr_units u ON u.organization_id = o.id
     GROUP BY o.id
     ORDER BY o.name COLLATE NOCASE`,
  ).all<{
    id: string;
    name: string;
    account_status: string;
    created_at: string;
    unit_count: number;
  }>();

  return result.results;
}

export async function createOrganization(env: Env, name: string) {
  const id = `org_${crypto.randomUUID().replaceAll("-", "")}`;
  await env.DB.prepare(
    `INSERT INTO organizations (id, name, account_status)
     VALUES (?1, ?2, 'trial')`,
  )
    .bind(id, name)
    .run();

  return {
    id,
    name,
    accountStatus: "trial",
    unitCount: 0,
  };
}

export async function getOrganization(env: Env, id: string) {
  const organization = await env.DB.prepare(
    `SELECT id, name, account_status, created_at, updated_at
     FROM organizations
     WHERE id = ?1`,
  )
    .bind(id)
    .first<{
      id: string;
      name: string;
      account_status: string;
      created_at: string;
      updated_at: string;
    }>();

  if (!organization) return null;

  const units = await env.DB.prepare(
    `SELECT
       id,
       unit_number,
       public_token,
       organization_id,
       display_name,
       destination_url,
       status,
       manufacturing_status,
       production_status,
       production_ready_at,
       plate_size_mm,
       generator_version,
       created_at,
       updated_at
     FROM smart_qr_units
     WHERE organization_id = ?1
     ORDER BY created_at DESC, unit_number DESC`,
  )
    .bind(id)
    .all<UnitRow>();

  const assets = await env.DB.prepare(
    `SELECT
       a.id,
       v.smart_qr_unit_id,
       a.asset_type,
       a.filename,
       a.content_type,
       a.byte_size,
       v.version
     FROM manufacturing_assets a
     JOIN manufacturing_asset_versions v ON v.id = a.asset_version_id
     JOIN smart_qr_units u ON u.id = v.smart_qr_unit_id
     WHERE u.organization_id = ?1
       AND v.status = 'ready'
       AND v.version = (
         SELECT MAX(v2.version)
         FROM manufacturing_asset_versions v2
         WHERE v2.smart_qr_unit_id = v.smart_qr_unit_id
           AND v2.status = 'ready'
       )
     ORDER BY a.asset_type`,
  )
    .bind(id)
    .all<AssetRow>();

  const assetsByUnit = new Map<string, AssetRow[]>();
  for (const asset of assets.results) {
    const existing = assetsByUnit.get(asset.smart_qr_unit_id) ?? [];
    existing.push(asset);
    assetsByUnit.set(asset.smart_qr_unit_id, existing);
  }

  return {
    id: organization.id,
    name: organization.name,
    accountStatus: organization.account_status,
    createdAt: organization.created_at,
    updatedAt: organization.updated_at,
    units: units.results.map((unit) => ({
      id: unit.id,
      unitNumber: unit.unit_number,
      publicToken: unit.public_token,
      permanentUrl: `https://q.voxelvandal.com/${unit.public_token}`,
      displayName: unit.display_name,
      destinationUrl: unit.destination_url,
      status: unit.status,
      manufacturingStatus: unit.manufacturing_status,
      productionStatus: unit.production_status,
      productionReadyAt: unit.production_ready_at,
      plateSizeMm: unit.plate_size_mm,
      generatorVersion: unit.generator_version,
      createdAt: unit.created_at,
      updatedAt: unit.updated_at,
      assets: (assetsByUnit.get(unit.id) ?? []).map((asset) => ({
        id: asset.id,
        type: asset.asset_type,
        filename: asset.filename,
        contentType: asset.content_type,
        byteSize: asset.byte_size,
        version: asset.version,
        downloadUrl: `/api/admin/assets/${asset.id}`,
      })),
    })),
  };
}

async function createAssetVersion(
  env: Env,
  smartQrUnitId: string,
): Promise<{ id: string; version: number }> {
  const current = await env.DB.prepare(
    `SELECT COALESCE(MAX(version), 0) AS version
     FROM manufacturing_asset_versions
     WHERE smart_qr_unit_id = ?1`,
  )
    .bind(smartQrUnitId)
    .first<{ version: number }>();
  const version = (current?.version ?? 0) + 1;
  const id = `assetver_${crypto.randomUUID().replaceAll("-", "")}`;

  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO manufacturing_asset_versions (
         id,
         smart_qr_unit_id,
         version,
         generator_version,
         status
       )
       VALUES (?1, ?2, ?3, '0.1.0', 'generating')`,
    ).bind(id, smartQrUnitId, version),
    env.DB.prepare(
      `UPDATE smart_qr_units
       SET manufacturing_status = 'generating', updated_at = CURRENT_TIMESTAMP
       WHERE id = ?1`,
    ).bind(smartQrUnitId),
  ]);

  return { id, version };
}

export async function createSmartQrUnit(
  env: Env,
  input: {
    organizationId: string;
    displayName: string;
    destinationUrl: string | null;
    plateSizeMm: number;
  },
) {
  const organization = await env.DB.prepare(
    "SELECT id FROM organizations WHERE id = ?1",
  )
    .bind(input.organizationId)
    .first<{ id: string }>();
  if (!organization) return null;

  const allocation = await env.DB.prepare(
    "INSERT INTO smart_qr_unit_numbers DEFAULT VALUES",
  ).run();
  const sequence = Number(allocation.meta.last_row_id);
  if (!Number.isSafeInteger(sequence) || sequence < 1) {
    throw new Error("Could not allocate the next unit number.");
  }

  const id = `unit_${crypto.randomUUID().replaceAll("-", "")}`;
  const token = generateToken();
  const nextUnitNumber = unitNumber(sequence);
  const status = "draft";

  await env.DB.prepare(
    `INSERT INTO smart_qr_units (
       id,
       unit_number,
       public_token,
       organization_id,
       display_name,
       destination_url,
       status,
       manufacturing_status,
       production_status,
       plate_size_mm,
       generator_version,
       activated_at
     )
     VALUES (
       ?1, ?2, ?3, ?4, ?5, ?6, ?7, 'generating', 'in_production',
       ?8, '0.1.0', NULL
     )`,
  )
    .bind(
      id,
      nextUnitNumber,
      token,
      input.organizationId,
      input.displayName,
      input.destinationUrl,
      status,
      input.plateSizeMm,
    )
    .run();

  const assetVersion = await createAssetVersion(env, id);

  return {
    id,
    unitNumber: nextUnitNumber,
    publicToken: token,
    permanentUrl: `https://q.voxelvandal.com/${token}`,
    displayName: input.displayName,
    destinationUrl: input.destinationUrl,
    status,
    manufacturingStatus: "generating",
    productionStatus: "in_production",
    productionReadyAt: null,
    plateSizeMm: input.plateSizeMm,
    assetVersionId: assetVersion.id,
    assetVersion: assetVersion.version,
  };
}

export async function regenerateSmartQrUnit(env: Env, unitId: string) {
  const unit = await env.DB.prepare(
    `SELECT
       id,
       unit_number,
       public_token,
       display_name,
       destination_url,
       status,
       production_status,
       production_ready_at,
       plate_size_mm
     FROM smart_qr_units
     WHERE id = ?1`,
  )
    .bind(unitId)
    .first<{
      id: string;
      unit_number: string;
      public_token: string;
      display_name: string | null;
      destination_url: string | null;
      status: string;
      production_status: ProductionStatus;
      production_ready_at: string | null;
      plate_size_mm: number;
    }>();
  if (!unit) return null;

  const assetVersion = await createAssetVersion(env, unit.id);
  return {
    id: unit.id,
    unitNumber: unit.unit_number,
    publicToken: unit.public_token,
    permanentUrl: `https://q.voxelvandal.com/${unit.public_token}`,
    displayName: unit.display_name,
    destinationUrl: unit.destination_url,
    status: unit.status,
    manufacturingStatus: "generating",
    productionStatus: unit.production_status,
    productionReadyAt: unit.production_ready_at,
    plateSizeMm: unit.plate_size_mm,
    assetVersionId: assetVersion.id,
    assetVersion: assetVersion.version,
  };
}

export async function updateSmartQrUnit(
  env: Env,
  unitId: string,
  input: {
    displayName: string;
    destinationUrl: string | null;
    status: "draft" | "active" | "paused" | "retired";
  },
) {
  const existing = await env.DB.prepare(
    `SELECT id, production_status
     FROM smart_qr_units
     WHERE id = ?1`,
  )
    .bind(unitId)
    .first<{ id: string; production_status: ProductionStatus }>();
  if (!existing) return null;

  const effectiveStatus = resolveScanStatus(
    input.status,
    input.destinationUrl,
    existing.production_status,
  );
  await env.DB.prepare(
    `UPDATE smart_qr_units
     SET
       display_name = ?2,
       destination_url = ?3,
       status = ?4,
       activated_at = CASE
         WHEN ?4 = 'active' AND activated_at IS NULL THEN CURRENT_TIMESTAMP
         ELSE activated_at
       END,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = ?1`,
  )
    .bind(
      unitId,
      input.displayName,
      input.destinationUrl,
      effectiveStatus,
    )
    .run();

  return { id: unitId, status: effectiveStatus };
}

export async function updateProductionStatus(
  env: Env,
  unitId: string,
  productionStatus: ProductionStatus,
) {
  const existing = await env.DB.prepare(
    `SELECT id, destination_url
     FROM smart_qr_units
     WHERE id = ?1`,
  )
    .bind(unitId)
    .first<{ id: string; destination_url: string | null }>();
  if (!existing) return null;

  const disabledStatus = existing.destination_url ? "paused" : "draft";
  await env.DB.prepare(
    `UPDATE smart_qr_units
     SET
       production_status = ?2,
       production_ready_at = CASE
         WHEN ?2 = 'ready' THEN COALESCE(production_ready_at, CURRENT_TIMESTAMP)
         ELSE NULL
       END,
       status = CASE
         WHEN ?2 = 'in_production' THEN ?3
         ELSE status
       END,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = ?1`,
  )
    .bind(unitId, productionStatus, disabledStatus)
    .run();

  return {
    id: unitId,
    productionStatus,
    status: productionStatus === "in_production" ? disabledStatus : undefined,
  };
}
