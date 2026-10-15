export type Point3 = {
  x: number;
  y: number;
  z: number;
};

export type Triangle = [number, number, number];

export type Mesh = {
  name: string;
  vertices: Point3[];
  triangles: Triangle[];
};

export type QrMatrix = {
  size: number;
  cells: boolean[][];
};

export type ManufacturingSpec = {
  unitNumber: string;
  redirectUrl: string;
  plateSizeMm: number;
  baseThicknessMm: number;
  featureHeightMm: number;
  moduleSizeMm: number;
  quietZoneModules: number;
  cornerRadiusMm: number;
  edgeBevelMm: number;
  errorCorrectionLevel: "Q";
};

export type ManufacturingArtifacts = {
  spec: ManufacturingSpec;
  matrix: QrMatrix;
  svg: string;
  combinedStl: Uint8Array;
};
