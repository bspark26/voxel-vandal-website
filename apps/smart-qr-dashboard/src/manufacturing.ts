import {
  buildManufacturingArtifacts,
  buildProductionPackage,
  createProductionNotes,
  drawManufacturingPreview,
  getScaledPlanarGeometry,
} from "@voxel-vandal/smart-qr-manufacturing";

import { uploadAssets } from "./api";
import type { GeneratedUnit } from "./types";

function canvasPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("PNG failed."))),
      "image/png",
    );
  });
}

function blob(bytes: Uint8Array, type: string): Blob {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new Blob([copy.buffer], { type });
}

export async function generateAndStoreAssets(
  unit: GeneratedUnit,
): Promise<void> {
  const planarGeometry = getScaledPlanarGeometry(unit.plateSizeMm);
  const artifacts = buildManufacturingArtifacts({
    unitNumber: unit.unitNumber,
    redirectUrl: unit.permanentUrl,
    plateSizeMm: unit.plateSizeMm,
    ...planarGeometry,
  });
  const canvas = document.createElement("canvas");
  drawManufacturingPreview(canvas, artifacts.matrix, artifacts.spec, 7);
  const png = await canvasPng(canvas);
  const pngBytes = new Uint8Array(await png.arrayBuffer());
  const productionPackage = buildProductionPackage(artifacts, pngBytes);
  const notes = createProductionNotes(artifacts);
  const safeUnit = unit.unitNumber.toLowerCase();

  const form = new FormData();
  form.set("assetVersionId", unit.assetVersionId);
  form.set(
    "svg",
    new File([artifacts.svg], `${safeUnit}.svg`, {
      type: "image/svg+xml",
    }),
  );
  form.set(
    "png",
    new File([png], `${safeUnit}-preview.png`, { type: "image/png" }),
  );
  form.set(
    "stl",
    new File(
      [blob(artifacts.combinedStl, "model/stl")],
      `${safeUnit}-complete-qr-insert.stl`,
      { type: "model/stl" },
    ),
  );
  form.set(
    "notes",
    new File([notes], `${safeUnit}-production-notes.txt`, {
      type: "text/plain",
    }),
  );
  form.set(
    "package",
    new File(
      [blob(productionPackage, "application/zip")],
      `${safeUnit}-production-package.zip`,
      { type: "application/zip" },
    ),
  );
  await uploadAssets(unit.id, form);
}
