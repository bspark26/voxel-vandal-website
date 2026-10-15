import type { Env } from "./types";

type AssetType = "svg" | "png" | "stl" | "notes" | "package";

const assetRules: Record<
  AssetType,
  { field: string; maxBytes: number; fallbackContentType: string }
> = {
  svg: {
    field: "svg",
    maxBytes: 1_000_000,
    fallbackContentType: "image/svg+xml",
  },
  png: {
    field: "png",
    maxBytes: 5_000_000,
    fallbackContentType: "image/png",
  },
  stl: {
    field: "stl",
    maxBytes: 15_000_000,
    fallbackContentType: "model/stl",
  },
  notes: {
    field: "notes",
    maxBytes: 200_000,
    fallbackContentType: "text/plain",
  },
  package: {
    field: "package",
    maxBytes: 25_000_000,
    fallbackContentType: "application/zip",
  },
};

function fileFromForm(form: FormData, field: string): File {
  const value = form.get(field);
  if (!(value instanceof File)) {
    throw new Error(`Missing ${field} manufacturing file.`);
  }
  return value;
}

function hex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export async function storeManufacturingAssets(
  env: Env,
  unitId: string,
  form: FormData,
) {
  const assetVersionId = form.get("assetVersionId");
  if (typeof assetVersionId !== "string" || !assetVersionId) {
    throw new Error("Missing manufacturing asset version.");
  }

  const context = await env.DB.prepare(
    `SELECT
       u.id AS unit_id,
       u.unit_number,
       u.organization_id,
       v.id AS version_id,
       v.version
     FROM smart_qr_units u
     JOIN manufacturing_asset_versions v ON v.smart_qr_unit_id = u.id
     WHERE u.id = ?1 AND v.id = ?2`,
  )
    .bind(unitId, assetVersionId)
    .first<{
      unit_id: string;
      unit_number: string;
      organization_id: string;
      version_id: string;
      version: number;
    }>();

  if (!context) {
    throw new Error("The manufacturing version does not belong to this unit.");
  }

  const safeUnit = context.unit_number.toLowerCase();
  const preparedAssets: Array<{
    id: string;
    type: AssetType;
    key: string;
    filename: string;
    contentType: string;
    bytes: Uint8Array;
    sha256: string;
  }> = [];

  for (const [type, rule] of Object.entries(assetRules) as Array<
    [AssetType, (typeof assetRules)[AssetType]]
  >) {
    const file = fileFromForm(form, rule.field);
    if (file.size > rule.maxBytes) {
      throw new Error(`${file.name} is larger than the allowed limit.`);
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    const filename =
      file.name ||
      `${safeUnit}.${type === "package" ? "zip" : type === "notes" ? "txt" : type}`;
    const key = [
      "organizations",
      context.organization_id,
      "units",
      context.unit_id,
      `v${context.version}`,
      filename,
    ].join("/");

    preparedAssets.push({
      id: `asset_${crypto.randomUUID().replaceAll("-", "")}`,
      type,
      key,
      filename,
      contentType: file.type || rule.fallbackContentType,
      bytes,
      sha256: hex(digest),
    });
  }

  try {
    await Promise.all(
      preparedAssets.map((asset) =>
        env.MANUFACTURING_ASSETS.put(asset.key, asset.bytes, {
          httpMetadata: { contentType: asset.contentType },
          customMetadata: {
            unitId: context.unit_id,
            unitNumber: context.unit_number,
            version: String(context.version),
            sha256: asset.sha256,
          },
        }),
      ),
    );

    const statements = preparedAssets.map((asset) =>
      env.DB.prepare(
        `INSERT INTO manufacturing_assets (
           id,
           asset_version_id,
           asset_type,
           r2_key,
           filename,
           content_type,
           byte_size,
           sha256
         )
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`,
      ).bind(
        asset.id,
        context.version_id,
        asset.type,
        asset.key,
        asset.filename,
        asset.contentType,
        asset.bytes.byteLength,
        asset.sha256,
      ),
    );
    statements.push(
      env.DB.prepare(
        `UPDATE manufacturing_asset_versions
         SET status = 'ready', completed_at = CURRENT_TIMESTAMP
         WHERE id = ?1`,
      ).bind(context.version_id),
      env.DB.prepare(
        `UPDATE smart_qr_units
         SET manufacturing_status = 'ready', updated_at = CURRENT_TIMESTAMP
         WHERE id = ?1`,
      ).bind(context.unit_id),
    );
    await env.DB.batch(statements);
  } catch (cause) {
    await env.DB.batch([
      env.DB.prepare(
        "UPDATE manufacturing_asset_versions SET status = 'failed' WHERE id = ?1",
      ).bind(context.version_id),
      env.DB.prepare(
        `UPDATE smart_qr_units
         SET manufacturing_status = 'failed', updated_at = CURRENT_TIMESTAMP
         WHERE id = ?1`,
      ).bind(context.unit_id),
    ]);
    throw cause;
  }

  return {
    unitId: context.unit_id,
    unitNumber: context.unit_number,
    version: context.version,
    assets: preparedAssets.map((asset) => ({
      id: asset.id,
      type: asset.type,
      filename: asset.filename,
      byteSize: asset.bytes.byteLength,
      downloadUrl: `/api/admin/assets/${asset.id}`,
    })),
  };
}

export async function downloadManufacturingAsset(
  env: Env,
  assetId: string,
  inline: boolean,
): Promise<Response | null> {
  const asset = await env.DB.prepare(
    `SELECT r2_key, filename, content_type, sha256
     FROM manufacturing_assets
     WHERE id = ?1`,
  )
    .bind(assetId)
    .first<{
      r2_key: string;
      filename: string;
      content_type: string;
      sha256: string;
    }>();
  if (!asset) return null;

  const object = await env.MANUFACTURING_ASSETS.get(asset.r2_key);
  if (!object) return null;

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Type", asset.content_type);
  headers.set("Cache-Control", "private, no-store");
  headers.set(
    "Content-Disposition",
    `${inline ? "inline" : "attachment"}; filename="${asset.filename.replaceAll('"', "")}"`,
  );
  headers.set("ETag", object.httpEtag);
  headers.set("X-Content-SHA256", asset.sha256);
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(object.body, { headers });
}

