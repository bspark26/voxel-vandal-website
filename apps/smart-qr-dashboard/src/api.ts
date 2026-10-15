import type {
  GeneratedUnit,
  AdminSession,
  Organization,
  OrganizationSummary,
} from "./types";

export async function getAdminSession(): Promise<AdminSession> {
  const result = await request<{ admin: AdminSession }>("/api/admin/session");
  return result.admin;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init);
  const body = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(body.error ?? `Request failed (${response.status}).`);
  }
  return body;
}

const jsonHeaders = { "Content-Type": "application/json" };

export async function listOrganizations(): Promise<OrganizationSummary[]> {
  const result = await request<{ organizations: OrganizationSummary[] }>(
    "/api/admin/organizations",
  );
  return result.organizations;
}

export async function getOrganization(id: string): Promise<Organization> {
  const result = await request<{ organization: Organization }>(
    `/api/admin/organizations/${encodeURIComponent(id)}`,
  );
  return result.organization;
}

export async function createOrganization(
  name: string,
): Promise<OrganizationSummary> {
  const result = await request<{ organization: OrganizationSummary }>(
    "/api/admin/organizations",
    {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ name }),
    },
  );
  return result.organization;
}

export async function createUnit(
  organizationId: string,
  input: {
    displayName: string;
    destinationUrl: string;
    plateSizeMm: number;
  },
): Promise<GeneratedUnit> {
  const result = await request<{ unit: GeneratedUnit }>(
    `/api/admin/organizations/${encodeURIComponent(organizationId)}/units`,
    {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(input),
    },
  );
  return result.unit;
}

export async function updateUnit(
  id: string,
  input: {
    displayName: string;
    destinationUrl: string;
    status: string;
  },
): Promise<void> {
  await request(`/api/admin/units/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: jsonHeaders,
    body: JSON.stringify(input),
  });
}

export async function updateProductionStatus(
  id: string,
  productionStatus: "in_production" | "ready",
): Promise<void> {
  await request(
    `/api/admin/units/${encodeURIComponent(id)}/production`,
    {
      method: "PATCH",
      headers: jsonHeaders,
      body: JSON.stringify({ productionStatus }),
    },
  );
}

export async function regenerateUnit(id: string): Promise<GeneratedUnit> {
  const result = await request<{ unit: GeneratedUnit }>(
    `/api/admin/units/${encodeURIComponent(id)}/regenerate`,
    { method: "POST" },
  );
  return result.unit;
}

export async function uploadAssets(
  id: string,
  form: FormData,
): Promise<void> {
  await request(`/api/admin/units/${encodeURIComponent(id)}/assets`, {
    method: "POST",
    body: form,
  });
}
