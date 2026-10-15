import {
  downloadManufacturingAsset,
  storeManufacturingAssets,
} from "./assets";
import { error, json, readJson } from "./http";
import {
  createOrganization,
  createSmartQrUnit,
  getOrganization,
  listOrganizations,
  regenerateSmartQrUnit,
  updateProductionStatus,
  updateSmartQrUnit,
} from "./repository";
import {
  cleanDisplayName,
  normalizeHttpsUrl,
} from "./security";
import type { AdminIdentity, Env } from "./types";

function plateSize(value: unknown): number | null {
  const number = Number(value);
  return number === 60 || number === 90 ? number : null;
}

export async function handleApi(
  request: Request,
  env: Env,
  admin: AdminIdentity | null,
): Promise<Response> {
  if (!admin) {
    return error(
      "The dashboard API is locked until customer authentication is configured.",
      403,
    );
  }

  const url = new URL(request.url);
  const path = url.pathname;

  try {
    if (request.method === "GET" && path === "/api/admin/session") {
      return json({ admin });
    }

    if (request.method === "GET" && path === "/api/admin/organizations") {
      const organizations = await listOrganizations(env);
      return json({
        organizations: organizations.map((organization) => ({
          id: organization.id,
          name: organization.name,
          accountStatus: organization.account_status,
          unitCount: Number(organization.unit_count),
          createdAt: organization.created_at,
        })),
      });
    }

    if (request.method === "POST" && path === "/api/admin/organizations") {
      const body = await readJson<{ name?: unknown }>(request);
      const name = cleanDisplayName(body.name);
      if (!name) return error("Enter a customer or business name.");
      return json({ organization: await createOrganization(env, name) }, 201);
    }

    const organizationMatch = path.match(
      /^\/api\/admin\/organizations\/([^/]+)$/,
    );
    if (request.method === "GET" && organizationMatch?.[1]) {
      const organization = await getOrganization(
        env,
        decodeURIComponent(organizationMatch[1]),
      );
      return organization
        ? json({ organization })
        : error("Customer account not found.", 404);
    }

    const createUnitMatch = path.match(
      /^\/api\/admin\/organizations\/([^/]+)\/units$/,
    );
    if (request.method === "POST" && createUnitMatch?.[1]) {
      const body = await readJson<{
        displayName?: unknown;
        destinationUrl?: unknown;
        plateSizeMm?: unknown;
      }>(request);
      const displayName = cleanDisplayName(body.displayName);
      const size = plateSize(body.plateSizeMm);
      const rawDestination =
        typeof body.destinationUrl === "string"
          ? body.destinationUrl.trim()
          : "";
      const destinationUrl = rawDestination
        ? normalizeHttpsUrl(rawDestination)
        : null;

      if (!displayName) return error("Enter a name for this Smart QR.");
      if (!size) return error("Choose a valid insert size.");
      if (rawDestination && !destinationUrl) {
        return error("Enter a valid web address, such as example.com/listing.");
      }

      const unit = await createSmartQrUnit(env, {
        organizationId: decodeURIComponent(createUnitMatch[1]),
        displayName,
        destinationUrl,
        plateSizeMm: size,
      });
      return unit
        ? json({ unit }, 201)
        : error("Customer account not found.", 404);
    }

    const regenerateMatch = path.match(
      /^\/api\/admin\/units\/([^/]+)\/regenerate$/,
    );
    if (request.method === "POST" && regenerateMatch?.[1]) {
      const unit = await regenerateSmartQrUnit(
        env,
        decodeURIComponent(regenerateMatch[1]),
      );
      return unit ? json({ unit }, 201) : error("Smart QR not found.", 404);
    }

    const updateUnitMatch = path.match(/^\/api\/admin\/units\/([^/]+)$/);
    if (request.method === "PATCH" && updateUnitMatch?.[1]) {
      const body = await readJson<{
        displayName?: unknown;
        destinationUrl?: unknown;
        status?: unknown;
      }>(request);
      const displayName = cleanDisplayName(body.displayName);
      const rawDestination =
        typeof body.destinationUrl === "string"
          ? body.destinationUrl.trim()
          : "";
      const destinationUrl = rawDestination
        ? normalizeHttpsUrl(rawDestination)
        : null;
      const allowedStatuses = ["draft", "active", "paused", "retired"];
      const status =
        typeof body.status === "string" &&
        allowedStatuses.includes(body.status)
          ? (body.status as "draft" | "active" | "paused" | "retired")
          : null;

      if (!displayName) return error("Enter a name for this Smart QR.");
      if (rawDestination && !destinationUrl) {
        return error("Enter a valid web address, such as example.com/listing.");
      }
      if (!status) return error("Choose a valid unit status.");

      const unit = await updateSmartQrUnit(
        env,
        decodeURIComponent(updateUnitMatch[1]),
        { displayName, destinationUrl, status },
      );
      return unit ? json({ unit }) : error("Smart QR not found.", 404);
    }

    const productionMatch = path.match(
      /^\/api\/admin\/units\/([^/]+)\/production$/,
    );
    if (request.method === "PATCH" && productionMatch?.[1]) {
      const body = await readJson<{ productionStatus?: unknown }>(request);
      const productionStatus =
        body.productionStatus === "in_production" ||
        body.productionStatus === "ready"
          ? body.productionStatus
          : null;
      if (!productionStatus) {
        return error("Choose a valid production status.");
      }

      const unit = await updateProductionStatus(
        env,
        decodeURIComponent(productionMatch[1]),
        productionStatus,
      );
      return unit ? json({ unit }) : error("Smart QR not found.", 404);
    }

    const uploadMatch = path.match(
      /^\/api\/admin\/units\/([^/]+)\/assets$/,
    );
    if (request.method === "POST" && uploadMatch?.[1]) {
      const result = await storeManufacturingAssets(
        env,
        decodeURIComponent(uploadMatch[1]),
        await request.formData(),
      );
      return json({ result }, 201);
    }

    const assetMatch = path.match(/^\/api\/admin\/assets\/([^/]+)$/);
    if (request.method === "GET" && assetMatch?.[1]) {
      const response = await downloadManufacturingAsset(
        env,
        decodeURIComponent(assetMatch[1]),
        url.searchParams.get("inline") === "1",
      );
      return response ?? error("Manufacturing file not found.", 404);
    }

    return error("API route not found.", 404);
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "Unexpected dashboard error.";
    return error(message, 500);
  }
}
