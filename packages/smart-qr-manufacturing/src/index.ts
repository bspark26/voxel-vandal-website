export {
  buildManufacturingArtifacts,
  buildProductionPackage,
  createProductionNotes,
  DEFAULT_SPEC,
  getScaledPlanarGeometry,
} from "./manufacturing";
export {
  createQrMatrix,
  generateSecureToken,
  normalizeUnitNumber,
} from "./qr";
export {
  createManufacturingSvg,
  drawManufacturingPreview,
} from "./svg";
export type {
  ManufacturingArtifacts,
  ManufacturingSpec,
  Mesh,
  Point3,
  QrMatrix,
  Triangle,
} from "./types";
