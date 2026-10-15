import type {
  ManufacturingSpec,
  Mesh,
  Point3,
  QrMatrix,
  Triangle,
} from "./types";

function appendBox(
  mesh: Mesh,
  x: number,
  y: number,
  z: number,
  width: number,
  depth: number,
  height: number,
): void {
  const start = mesh.vertices.length;
  mesh.vertices.push(
    { x, y, z },
    { x: x + width, y, z },
    { x: x + width, y: y + depth, z },
    { x, y: y + depth, z },
    { x, y, z: z + height },
    { x: x + width, y, z: z + height },
    { x: x + width, y: y + depth, z: z + height },
    { x, y: y + depth, z: z + height },
  );

  const faces: Triangle[] = [
    [0, 2, 1],
    [0, 3, 2],
    [4, 5, 6],
    [4, 6, 7],
    [0, 1, 5],
    [0, 5, 4],
    [1, 2, 6],
    [1, 6, 5],
    [2, 3, 7],
    [2, 7, 6],
    [3, 0, 4],
    [3, 4, 7],
  ];

  mesh.triangles.push(
    ...faces.map(
      ([a, b, c]) => [start + a, start + b, start + c] as Triangle,
    ),
  );
}

function roundedRectanglePerimeter(
  width: number,
  height: number,
  radius: number,
  segmentsPerCorner = 8,
): Array<{ x: number; y: number }> {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  const corners = [
    { x: width - safeRadius, y: safeRadius, start: -Math.PI / 2 },
    { x: width - safeRadius, y: height - safeRadius, start: 0 },
    { x: safeRadius, y: height - safeRadius, start: Math.PI / 2 },
    { x: safeRadius, y: safeRadius, start: Math.PI },
  ];

  return corners.flatMap((corner) =>
    Array.from({ length: segmentsPerCorner + 1 }, (_, index) => {
      const angle =
        corner.start + (index / segmentsPerCorner) * (Math.PI / 2);
      return {
        x: corner.x + Math.cos(angle) * safeRadius,
        y: corner.y + Math.sin(angle) * safeRadius,
      };
    }),
  );
}

export function createRoundedPlateMesh(spec: ManufacturingSpec): Mesh {
  const mesh: Mesh = {
    name: `${spec.unitNumber} white insert`,
    vertices: [],
    triangles: [],
  };
  const outerPerimeter = roundedRectanglePerimeter(
    spec.plateSizeMm,
    spec.plateSizeMm,
    spec.cornerRadiusMm,
  );
  const safeBevel = Math.min(
    spec.edgeBevelMm,
    spec.baseThicknessMm / 2,
    spec.cornerRadiusMm / 2,
  );
  const topPerimeter = roundedRectanglePerimeter(
    spec.plateSizeMm - safeBevel * 2,
    spec.plateSizeMm - safeBevel * 2,
    Math.max(0.4, spec.cornerRadiusMm - safeBevel),
  ).map(({ x, y }) => ({ x: x + safeBevel, y: y + safeBevel }));
  const bottomCenterIndex = mesh.vertices.length;
  mesh.vertices.push({
    x: spec.plateSizeMm / 2,
    y: spec.plateSizeMm / 2,
    z: 0,
  });
  const topCenterIndex = mesh.vertices.length;
  mesh.vertices.push({
    x: spec.plateSizeMm / 2,
    y: spec.plateSizeMm / 2,
    z: spec.baseThicknessMm,
  });
  const bottomStart = mesh.vertices.length;
  mesh.vertices.push(
    ...outerPerimeter.map(({ x, y }) => ({ x, y, z: 0 })),
  );
  const bevelStart = mesh.vertices.length;
  mesh.vertices.push(
    ...outerPerimeter.map(({ x, y }) => ({
      x,
      y,
      z: spec.baseThicknessMm - safeBevel,
    })),
  );
  const topStart = mesh.vertices.length;
  mesh.vertices.push(
    ...topPerimeter.map(({ x, y }) => ({
      x,
      y,
      z: spec.baseThicknessMm,
    })),
  );

  for (let index = 0; index < outerPerimeter.length; index += 1) {
    const next = (index + 1) % outerPerimeter.length;
    const bottom = bottomStart + index;
    const bottomNext = bottomStart + next;
    const bevel = bevelStart + index;
    const bevelNext = bevelStart + next;
    const top = topStart + index;
    const topNext = topStart + next;

    mesh.triangles.push(
      [bottomCenterIndex, bottomNext, bottom],
      [topCenterIndex, top, topNext],
      [bottom, bottomNext, bevelNext],
      [bottom, bevelNext, bevel],
      [bevel, bevelNext, topNext],
      [bevel, topNext, top],
    );
  }

  return mesh;
}

export function createQrDetailsMesh(
  matrix: QrMatrix,
  spec: ManufacturingSpec,
): Mesh {
  const mesh: Mesh = {
    name: `${spec.unitNumber} black QR`,
    vertices: [],
    triangles: [],
  };
  const fieldSizeMm =
    (matrix.size + spec.quietZoneModules * 2) * spec.moduleSizeMm;
  const fieldOrigin = (spec.plateSizeMm - fieldSizeMm) / 2;
  const featureZ = spec.baseThicknessMm;

  for (let row = 0; row < matrix.size; row += 1) {
    const rowCells = matrix.cells[row];
    if (!rowCells) continue;

    let column = 0;
    while (column < matrix.size) {
      if (!rowCells[column]) {
        column += 1;
        continue;
      }

      const runStart = column;
      while (column < matrix.size && rowCells[column]) {
        column += 1;
      }

      const runLength = column - runStart;
      const x =
        fieldOrigin +
        (spec.quietZoneModules + runStart) * spec.moduleSizeMm;
      const y =
        fieldOrigin +
        (spec.quietZoneModules + matrix.size - 1 - row) *
          spec.moduleSizeMm;

      appendBox(
        mesh,
        x,
        y,
        featureZ,
        runLength * spec.moduleSizeMm,
        spec.moduleSizeMm,
        spec.featureHeightMm,
      );
    }
  }

  return mesh;
}

export function assertGeometryFits(
  matrix: QrMatrix,
  spec: ManufacturingSpec,
): void {
  const requiredSize =
    (matrix.size + spec.quietZoneModules * 2) * spec.moduleSizeMm +
    2;

  if (requiredSize > spec.plateSizeMm) {
    throw new Error(
      `The QR geometry needs ${requiredSize.toFixed(1)} mm but the selected plate is only ${spec.plateSizeMm} mm.`,
    );
  }
}

export function combineMeshes(name: string, meshes: Mesh[]): Mesh {
  const combined: Mesh = { name, vertices: [], triangles: [] };

  for (const mesh of meshes) {
    const vertexOffset = combined.vertices.length;
    combined.vertices.push(...mesh.vertices);
    combined.triangles.push(
      ...mesh.triangles.map(
        ([a, b, c]) =>
          [a + vertexOffset, b + vertexOffset, c + vertexOffset] as Triangle,
      ),
    );
  }

  return combined;
}

export function calculateNormal(
  a: Point3,
  b: Point3,
  c: Point3,
): Point3 {
  const ab = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
  const ac = { x: c.x - a.x, y: c.y - a.y, z: c.z - a.z };
  const cross = {
    x: ab.y * ac.z - ab.z * ac.y,
    y: ab.z * ac.x - ab.x * ac.z,
    z: ab.x * ac.y - ab.y * ac.x,
  };
  const length = Math.hypot(cross.x, cross.y, cross.z) || 1;

  return {
    x: cross.x / length,
    y: cross.y / length,
    z: cross.z / length,
  };
}
