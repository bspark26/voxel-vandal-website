import { createRemoteJWKSet, jwtVerify } from "jose";

import type { AdminIdentity, Env } from "./types";

const keySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function normalizedTeamDomain(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

function localAdmin(request: Request, env: Env): AdminIdentity | null {
  if (env.DASHBOARD_MODE !== "local-only") return null;
  const hostname = new URL(request.url).hostname;
  return hostname === "127.0.0.1" || hostname === "localhost"
    ? { email: "local-admin@voxelvandal.com", mode: "local" }
    : null;
}

export function allowLocalAdmin(request: Request, env: Env): boolean {
  return localAdmin(request, env) !== null;
}

export async function authenticateAdmin(
  request: Request,
  env: Env,
): Promise<AdminIdentity | null> {
  const local = localAdmin(request, env);
  if (local) return local;
  if (env.DASHBOARD_MODE !== "cloudflare-access") return null;

  const teamDomain = normalizedTeamDomain(env.TEAM_DOMAIN);
  const audience = env.POLICY_AUD?.trim();
  const approvedEmails = new Set(
    (env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
  const token = request.headers.get("cf-access-jwt-assertion");
  if (!teamDomain || !audience || !token || approvedEmails.size === 0) {
    return null;
  }

  try {
    let keySet = keySets.get(teamDomain);
    if (!keySet) {
      keySet = createRemoteJWKSet(
        new URL(`${teamDomain}/cdn-cgi/access/certs`),
      );
      keySets.set(teamDomain, keySet);
    }
    const { payload } = await jwtVerify(token, keySet, {
      issuer: teamDomain,
      audience,
    });
    const email =
      typeof payload.email === "string" ? payload.email.toLowerCase() : "";
    if (!approvedEmails.has(email)) return null;
    return { email, mode: "cloudflare-access" };
  } catch {
    return null;
  }
}

export function normalizeHttpsUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.trim() === "") return null;

  try {
    let candidate = value.trim();
    if (candidate.startsWith("//")) {
      candidate = `https:${candidate}`;
    } else if (!/^[a-z][a-z\d+.-]*:\/\//i.test(candidate)) {
      candidate = `https://${candidate}`;
    }

    const url = new URL(candidate);
    if (url.protocol === "http:") url.protocol = "https:";
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      !url.hostname.includes(".") ||
      url.hostname.startsWith(".") ||
      url.hostname.endsWith(".")
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export function cleanDisplayName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim().replace(/\s+/g, " ");
  return cleaned.length > 0 && cleaned.length <= 100 ? cleaned : null;
}
