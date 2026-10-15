import {
  buildManufacturingArtifacts,
  buildProductionPackage,
  createProductionNotes,
  getScaledPlanarGeometry,
} from "@voxel-vandal/smart-qr-manufacturing";
import { describe, expect, it } from "vitest";

describe("saved manufacturing package", () => {
  it("uses the reserved unit identity and permanent URL", () => {
    const artifacts = buildManufacturingArtifacts({
      unitNumber: "VV-00002",
      redirectUrl: "https://q.voxelvandal.com/TestToken123",
    });

    expect(artifacts.svg).toContain("VV-00002");
    expect(artifacts.svg).toContain("https://q.voxelvandal.com/TestToken123");
    expect(artifacts.combinedStl.byteLength).toBeGreaterThan(1_000);
    expect(createProductionNotes(artifacts)).toContain(
      "Permanent URL: https://q.voxelvandal.com/TestToken123",
    );
    expect(buildProductionPackage(artifacts).byteLength).toBeGreaterThan(1_000);
  });

  it("scales the complete 60 mm footprint to two-thirds of 90 mm", () => {
    const make = (plateSizeMm: number) =>
      buildManufacturingArtifacts({
        unitNumber: "VV-00002",
        redirectUrl: "https://q.voxelvandal.com/TestToken123",
        plateSizeMm,
        ...getScaledPlanarGeometry(plateSizeMm),
      });
    const sixty = make(60);
    const ninety = make(90);

    const bounds = (stl: Uint8Array, raisedOnly = false) => {
      const points = Array.from(
        new TextDecoder().decode(stl).matchAll(
          /vertex ([\d.-]+) ([\d.-]+) ([\d.-]+)/g,
        ),
        (match) => ({
          x: Number(match[1]),
          y: Number(match[2]),
          z: Number(match[3]),
        }),
      ).filter((point) => !raisedOnly || point.z > 2.4);

      return {
        width:
          Math.max(...points.map((point) => point.x)) -
          Math.min(...points.map((point) => point.x)),
        height:
          Math.max(...points.map((point) => point.y)) -
          Math.min(...points.map((point) => point.y)),
      };
    };

    const sixtyPlate = bounds(sixty.combinedStl);
    const ninetyPlate = bounds(ninety.combinedStl);
    const sixtyQr = bounds(sixty.combinedStl, true);
    const ninetyQr = bounds(ninety.combinedStl, true);

    expect(sixtyPlate.width).toBeCloseTo(60, 4);
    expect(sixtyPlate.height).toBeCloseTo(60, 4);
    expect(ninetyPlate.width).toBeCloseTo(90, 4);
    expect(ninetyPlate.height).toBeCloseTo(90, 4);
    expect(sixtyQr.width / ninetyQr.width).toBeCloseTo(2 / 3, 4);
    expect(sixtyQr.height / ninetyQr.height).toBeCloseTo(2 / 3, 4);
    expect(sixty.spec.cornerRadiusMm / ninety.spec.cornerRadiusMm).toBeCloseTo(
      2 / 3,
      8,
    );
    expect(sixty.spec.edgeBevelMm / ninety.spec.edgeBevelMm).toBeCloseTo(
      2 / 3,
      8,
    );
  });
});
