import { strToU8, zipSync } from "fflate";

import {
  assertGeometryFits,
  combineMeshes,
  createQrDetailsMesh,
  createRoundedPlateMesh,
} from "./geometry";
import { createQrMatrix, normalizeUnitNumber } from "./qr";
import { meshToAsciiStl } from "./stl";
import { createManufacturingSvg } from "./svg";
import type {
  ManufacturingArtifacts,
  ManufacturingSpec,
} from "./types";

export const DEFAULT_SPEC = {
  plateSizeMm: 90,
  baseThicknessMm: 2.4,
  featureHeightMm: 2,
  moduleSizeMm: 2.1,
  quietZoneModules: 4,
  cornerRadiusMm: 7,
  edgeBevelMm: 0.6,
  errorCorrectionLevel: "Q",
} as const;

export function getScaledPlanarGeometry(plateSizeMm: number): {
  moduleSizeMm: number;
  cornerRadiusMm: number;
  edgeBevelMm: number;
} {
  if (!Number.isFinite(plateSizeMm) || plateSizeMm <= 0) {
    throw new Error("Plate size must be a positive number.");
  }

  const scale = plateSizeMm / DEFAULT_SPEC.plateSizeMm;
  return {
    moduleSizeMm: DEFAULT_SPEC.moduleSizeMm * scale,
    cornerRadiusMm: DEFAULT_SPEC.cornerRadiusMm * scale,
    edgeBevelMm: DEFAULT_SPEC.edgeBevelMm * scale,
  };
}

export function buildManufacturingArtifacts(
  input: Pick<ManufacturingSpec, "unitNumber" | "redirectUrl"> &
    Partial<Omit<ManufacturingSpec, "unitNumber" | "redirectUrl">>,
): ManufacturingArtifacts {
  const spec: ManufacturingSpec = {
    ...DEFAULT_SPEC,
    ...input,
    unitNumber: normalizeUnitNumber(input.unitNumber),
  };

  if (!URL.canParse(spec.redirectUrl)) {
    throw new Error("The permanent redirect URL is invalid.");
  }

  const url = new URL(spec.redirectUrl);
  if (url.protocol !== "https:") {
    throw new Error("Permanent QR addresses must use HTTPS.");
  }

  const matrix = createQrMatrix(spec.redirectUrl, spec.errorCorrectionLevel);
  assertGeometryFits(matrix, spec);
  const baseMesh = createRoundedPlateMesh(spec);
  const detailsMesh = createQrDetailsMesh(matrix, spec);
  const combinedMesh = combineMeshes(
    `${spec.unitNumber} complete QR insert`,
    [baseMesh, detailsMesh],
  );

  return {
    spec,
    matrix,
    svg: createManufacturingSvg(matrix, spec),
    combinedStl: meshToAsciiStl(combinedMesh),
  };
}

export function buildProductionPackage(
  artifacts: ManufacturingArtifacts,
  previewPng?: Uint8Array,
): Uint8Array {
  const safeUnit = artifacts.spec.unitNumber.toLowerCase();
  const files: Record<string, Uint8Array> = {
    [`${safeUnit}/${safeUnit}.svg`]: strToU8(artifacts.svg),
    [`${safeUnit}/${safeUnit}-complete-qr-insert.stl`]:
      artifacts.combinedStl,
    [`${safeUnit}/PRODUCTION-NOTES.txt`]: strToU8(
      createProductionNotes(artifacts),
    ),
  };

  if (previewPng) {
    files[`${safeUnit}/${safeUnit}-preview.png`] = previewPng;
  }

  return zipSync(files, { level: 6 });
}

export function createProductionNotes(
  artifacts: ManufacturingArtifacts,
): string {
  return [
    `Voxel Vandal Smart QR ${artifacts.spec.unitNumber}`,
    "",
    `Permanent URL: ${artifacts.spec.redirectUrl}`,
    `Plate: ${artifacts.spec.plateSizeMm} mm square`,
    `White base: ${artifacts.spec.baseThicknessMm} mm`,
    `Black QR: ${artifacts.spec.featureHeightMm} mm raised`,
    `Outer edge bevel: ${artifacts.spec.edgeBevelMm} mm`,
    `QR error correction: ${artifacts.spec.errorCorrectionLevel}`,
    `QR matrix: ${artifacts.matrix.size} x ${artifacts.matrix.size} modules`,
    `Printed module size: ${artifacts.spec.moduleSizeMm} mm`,
    `Quiet zone: ${artifacts.spec.quietZoneModules} modules`,
    "",
    "Bambu Studio colour workflow:",
    "1. Import the combined STL and print it face-up.",
    `2. Print the insert in white through Z=${artifacts.spec.baseThicknessMm} mm.`,
    `3. Add one filament change at Z=${artifacts.spec.baseThicknessMm} mm.`,
    `4. Print the remaining ${artifacts.spec.featureHeightMm} mm raised QR in black.`,
    "Scan-test the finished part before assigning it to a customer.",
    "",
  ].join("\n");
}
