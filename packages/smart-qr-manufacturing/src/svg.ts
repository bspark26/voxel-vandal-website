import type { ManufacturingSpec, QrMatrix } from "./types";

function number(value: number): string {
  return Number(value.toFixed(4)).toString();
}

export function createManufacturingSvg(
  matrix: QrMatrix,
  spec: ManufacturingSpec,
): string {
  const fieldSizeMm =
    (matrix.size + spec.quietZoneModules * 2) * spec.moduleSizeMm;
  const fieldOrigin = (spec.plateSizeMm - fieldSizeMm) / 2;
  const modules: string[] = [];

  for (let row = 0; row < matrix.size; row += 1) {
    const rowCells = matrix.cells[row];
    if (!rowCells) continue;

    for (let column = 0; column < matrix.size; column += 1) {
      if (!rowCells[column]) continue;
      const x =
        fieldOrigin +
        (spec.quietZoneModules + column) * spec.moduleSizeMm;
      const y =
        fieldOrigin +
        (spec.quietZoneModules + row) * spec.moduleSizeMm;
      modules.push(
        `<rect x="${number(x)}" y="${number(y)}" width="${number(spec.moduleSizeMm)}" height="${number(spec.moduleSizeMm)}"/>`,
      );
    }
  }

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" width="${spec.plateSizeMm}mm" height="${spec.plateSizeMm}mm" viewBox="0 0 ${spec.plateSizeMm} ${spec.plateSizeMm}">`,
    `  <title>${spec.unitNumber} Smart QR manufacturing artwork</title>`,
    `  <desc>Permanent QR for ${spec.redirectUrl}. White background and black raised details.</desc>`,
    `  <rect width="${spec.plateSizeMm}" height="${spec.plateSizeMm}" rx="${spec.cornerRadiusMm}" fill="#fff"/>`,
    `  <g fill="#000" shape-rendering="crispEdges">`,
    ...modules.map((module) => `    ${module}`),
    "  </g>",
    "</svg>",
    "",
  ].join("\n");
}

export function drawManufacturingPreview(
  canvas: HTMLCanvasElement,
  matrix: QrMatrix,
  spec: ManufacturingSpec,
  pixelsPerMillimetre = 10,
): void {
  const pixelSize = Math.round(spec.plateSizeMm * pixelsPerMillimetre);
  canvas.width = pixelSize;
  canvas.height = pixelSize;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available.");

  const scale = pixelSize / spec.plateSizeMm;
  const fieldSizeMm =
    (matrix.size + spec.quietZoneModules * 2) * spec.moduleSizeMm;
  const fieldOrigin = (spec.plateSizeMm - fieldSizeMm) / 2;

  context.clearRect(0, 0, pixelSize, pixelSize);
  context.fillStyle = "#fff";
  context.beginPath();
  context.roundRect(
    0,
    0,
    pixelSize,
    pixelSize,
    spec.cornerRadiusMm * scale,
  );
  context.fill();
  context.fillStyle = "#000";

  for (let row = 0; row < matrix.size; row += 1) {
    const rowCells = matrix.cells[row];
    if (!rowCells) continue;
    for (let column = 0; column < matrix.size; column += 1) {
      if (!rowCells[column]) continue;
      context.fillRect(
        (fieldOrigin +
          (spec.quietZoneModules + column) * spec.moduleSizeMm) *
          scale,
        (fieldOrigin + (spec.quietZoneModules + row) * spec.moduleSizeMm) *
          scale,
        spec.moduleSizeMm * scale,
        spec.moduleSizeMm * scale,
      );
    }
  }
}
