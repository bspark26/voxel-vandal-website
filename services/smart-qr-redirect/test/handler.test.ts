import { describe, expect, it } from "vitest";

import { handleRequest } from "../src/handler";
import type { RedirectStore, SmartQrUnit } from "../src/types";

const activeUnit: SmartQrUnit = {
  unitNumber: "VV-00001",
  publicToken: "TEST7mP4x9Q2",
  destinationUrl: "https://voxelvandal.com/smart-qr/",
  status: "active",
};

class FakeStore implements RedirectStore {
  constructor(
    private readonly unit: SmartQrUnit | null = activeUnit,
    private readonly healthy = true,
  ) {}

  async findByPublicToken(): Promise<SmartQrUnit | null> {
    return this.unit;
  }

  async healthcheck(): Promise<boolean> {
    return this.healthy;
  }
}

describe("Smart QR redirect handler", () => {
  it("temporarily redirects an active unit without caching", async () => {
    const response = await handleRequest(
      new Request("https://q.voxelvandal.com/TEST7mP4x9Q2"),
      new FakeStore(),
    );

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe(
      "https://voxelvandal.com/smart-qr/",
    );
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("reflects a changed destination for the same permanent token", async () => {
    const changedUnit = {
      ...activeUnit,
      destinationUrl: "https://voxelvandal.com/contact/",
    };
    const response = await handleRequest(
      new Request("https://q.voxelvandal.com/TEST7mP4x9Q2"),
      new FakeStore(changedUnit),
    );

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe(
      "https://voxelvandal.com/contact/",
    );
  });

  it("shows a controlled page for a paused unit", async () => {
    const response = await handleRequest(
      new Request("https://q.voxelvandal.com/TEST7mP4x9Q2"),
      new FakeStore({ ...activeUnit, status: "paused" }),
    );

    expect(response.status).toBe(200);
    expect(await response.text()).toContain("This display is paused.");
  });

  it("returns gone for a retired unit", async () => {
    const response = await handleRequest(
      new Request("https://q.voxelvandal.com/TEST7mP4x9Q2"),
      new FakeStore({ ...activeUnit, status: "retired" }),
    );

    expect(response.status).toBe(410);
  });

  it("never redirects a non-active unit", async () => {
    for (const status of ["draft", "paused", "retired"] as const) {
      const response = await handleRequest(
        new Request("https://q.voxelvandal.com/TEST7mP4x9Q2"),
        new FakeStore({ ...activeUnit, status }),
      );

      expect(response.status).not.toBe(302);
      expect(response.headers.get("location")).toBeNull();
    }
  });

  it("rejects unknown and malformed tokens", async () => {
    const unknown = await handleRequest(
      new Request("https://q.voxelvandal.com/TEST7mP4x9Q2"),
      new FakeStore(null),
    );
    const malformed = await handleRequest(
      new Request("https://q.voxelvandal.com/not-valid"),
      new FakeStore(),
    );

    expect(unknown.status).toBe(404);
    expect(malformed.status).toBe(404);
  });

  it("refuses unsafe destination schemes", async () => {
    const response = await handleRequest(
      new Request("https://q.voxelvandal.com/TEST7mP4x9Q2"),
      new FakeStore({ ...activeUnit, destinationUrl: "javascript:alert(1)" }),
    );

    expect(response.status).toBe(503);
    expect(response.headers.get("location")).toBeNull();
  });

  it("reports database health", async () => {
    const response = await handleRequest(
      new Request("https://q.voxelvandal.com/health"),
      new FakeStore(),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      service: "smart-qr-redirect",
      status: "ok",
    });
  });
});
