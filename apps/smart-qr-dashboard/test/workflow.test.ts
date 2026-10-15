import { describe, expect, it } from "vitest";

import { resolveScanStatus } from "../worker/workflow";

describe("physical production workflow", () => {
  it("never enables scans while a display is in production", () => {
    expect(
      resolveScanStatus(
        "active",
        "https://voxelvandal.com/",
        "in_production",
      ),
    ).toBe("paused");
  });

  it("requires a destination before scans can be enabled", () => {
    expect(resolveScanStatus("active", null, "ready")).toBe("draft");
  });

  it("allows a ready display with a destination to be enabled", () => {
    expect(
      resolveScanStatus("active", "https://voxelvandal.com/", "ready"),
    ).toBe("active");
  });
});
