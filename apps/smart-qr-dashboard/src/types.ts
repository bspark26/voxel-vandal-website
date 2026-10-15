export type AssetType = "svg" | "png" | "stl" | "notes" | "package";

export type ManufacturingAsset = {
  id: string;
  type: AssetType;
  filename: string;
  contentType: string;
  byteSize: number;
  version: number;
  downloadUrl: string;
};

export type SmartQrUnit = {
  id: string;
  unitNumber: string;
  publicToken: string;
  permanentUrl: string;
  displayName: string | null;
  destinationUrl: string | null;
  status: "draft" | "active" | "paused" | "retired";
  manufacturingStatus: "not_started" | "generating" | "ready" | "failed";
  productionStatus: "in_production" | "ready";
  productionReadyAt: string | null;
  plateSizeMm: number;
  generatorVersion: string;
  createdAt: string;
  updatedAt: string;
  assets: ManufacturingAsset[];
};

export type OrganizationSummary = {
  id: string;
  name: string;
  accountStatus: string;
  unitCount: number;
  createdAt: string;
};

export type Organization = Omit<OrganizationSummary, "unitCount"> & {
  updatedAt: string;
  units: SmartQrUnit[];
};

export type GeneratedUnit = Omit<
  SmartQrUnit,
  "assets" | "generatorVersion" | "createdAt" | "updatedAt"
> & {
  assetVersionId: string;
  assetVersion: number;
};

export type AdminSession = {
  email: string;
  mode: "local" | "cloudflare-access";
};
