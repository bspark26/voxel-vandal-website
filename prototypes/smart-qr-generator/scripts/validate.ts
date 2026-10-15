import { strFromU8, unzipSync } from "fflate";

import {
  buildManufacturingArtifacts,
  buildProductionPackage,
} from "@voxel-vandal/smart-qr-manufacturing";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const artifacts = buildManufacturingArtifacts({
  unitNumber: "VV-00001",
  redirectUrl: "https://q.voxelvandal.com/TEST7mP4x9Q",
  plateSizeMm: 90,
});

assert(artifacts.matrix.size >= 29, "QR matrix was unexpectedly small.");
assert(
  artifacts.svg.includes("https://q.voxelvandal.com/TEST7mP4x9Q"),
  "SVG is missing its permanent URL metadata.",
);
assert(
  strFromU8(artifacts.combinedStl).includes("facet normal"),
  "Combined insert STL contains no triangles.",
);

const packageFiles = unzipSync(buildProductionPackage(artifacts));
const packageNames = Object.keys(packageFiles);
assert(packageNames.some((name) => name.endsWith(".svg")), "ZIP has no SVG.");
assert(
  packageNames.filter((name) => name.endsWith(".stl")).length === 1,
  "ZIP must contain one combined STL file.",
);
assert(
  !packageNames.some((name) => name.endsWith(".3mf")),
  "ZIP should not contain a 3MF.",
);
assert(
  packageNames.some((name) => name.endsWith("PRODUCTION-NOTES.txt")),
  "ZIP has no production notes.",
);
const notesEntry = Object.entries(packageFiles).find(([name]) =>
  name.endsWith("PRODUCTION-NOTES.txt"),
);
assert(notesEntry, "ZIP production notes could not be read.");
const notes = strFromU8(notesEntry[1]);
assert(
  notes.includes("Add one filament change at Z=2.4 mm"),
  "Production notes are missing the Bambu filament-change height.",
);

console.log(
  [
    "Smart QR generator validation passed.",
    `QR matrix: ${artifacts.matrix.size} × ${artifacts.matrix.size}`,
    `SVG: ${artifacts.svg.length.toLocaleString()} characters`,
    `Combined insert STL: ${artifacts.combinedStl.byteLength.toLocaleString()} bytes`,
    `Production package: ${buildProductionPackage(artifacts).byteLength.toLocaleString()} bytes`,
  ].join("\n"),
);
