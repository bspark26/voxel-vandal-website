import { describe, expect, it } from "vitest";

import {
  allowLocalAdmin,
  authenticateAdmin,
  cleanDisplayName,
  normalizeHttpsUrl,
} from "../worker/security";
import type { Env } from "../worker/types";

const env = { DASHBOARD_MODE: "local-only" } as Env;

describe("local dashboard guard", () => {
  it("allows the local development hosts", () => {
    expect(allowLocalAdmin(new Request("http://localhost/api/test"), env)).toBe(
      true,
    );
    expect(
      allowLocalAdmin(new Request("http://127.0.0.1/api/test"), env),
    ).toBe(true);
  });

  it("refuses public hosts and non-local modes", () => {
    expect(
      allowLocalAdmin(new Request("https://dashboard.voxelvandal.com/api/test"), env),
    ).toBe(false);
    expect(
      allowLocalAdmin(new Request("http://localhost/api/test"), {
        ...env,
        DASHBOARD_MODE: "production",
      }),
    ).toBe(false);
  });

  it("fails closed when Cloudflare Access configuration or JWT is missing", async () => {
    expect(
      await authenticateAdmin(
        new Request("https://admin.voxelvandal.com"),
        {
          ...env,
          DASHBOARD_MODE: "cloudflare-access",
          TEAM_DOMAIN: "https://voxel-vandal.cloudflareaccess.com",
          POLICY_AUD: "test-audience",
          ADMIN_EMAILS: "agentbrook@gmail.com",
        },
      ),
    ).toBeNull();
  });
});

describe("admin input validation", () => {
  it("normalizes common destination formats to HTTPS", () => {
    expect(normalizeHttpsUrl("https://voxelvandal.com")).toBe(
      "https://voxelvandal.com/",
    );
    expect(normalizeHttpsUrl("voxelvandal.com/smart-qr")).toBe(
      "https://voxelvandal.com/smart-qr",
    );
    expect(normalizeHttpsUrl("www.voxelvandal.com")).toBe(
      "https://www.voxelvandal.com/",
    );
    expect(normalizeHttpsUrl("http://voxelvandal.com")).toBe(
      "https://voxelvandal.com/",
    );
    expect(normalizeHttpsUrl("not a website")).toBeNull();
  });

  it("normalizes display names", () => {
    expect(cleanDisplayName("  Aspen   Ridge Realty  ")).toBe(
      "Aspen Ridge Realty",
    );
    expect(cleanDisplayName("")).toBeNull();
  });
});
