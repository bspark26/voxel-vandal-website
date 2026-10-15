export interface Env {
  DB: D1Database;
  MANUFACTURING_ASSETS: R2Bucket;
  STATIC_ASSETS: Fetcher;
  DASHBOARD_MODE: string;
  TEAM_DOMAIN?: string;
  POLICY_AUD?: string;
  ADMIN_EMAILS?: string;
}

export type AdminIdentity = {
  email: string;
  mode: "local" | "cloudflare-access";
};

export type AccountStatus = "trial" | "active" | "past_due" | "inactive";
export type UnitStatus = "draft" | "active" | "paused" | "retired";
export type ManufacturingStatus =
  | "not_started"
  | "generating"
  | "ready"
  | "failed";
export type ProductionStatus = "in_production" | "ready";

export type UnitRow = {
  id: string;
  unit_number: string;
  public_token: string;
  organization_id: string | null;
  display_name: string | null;
  destination_url: string | null;
  status: UnitStatus;
  manufacturing_status: ManufacturingStatus;
  production_status: ProductionStatus;
  production_ready_at: string | null;
  plate_size_mm: number;
  generator_version: string;
  created_at: string;
  updated_at: string;
};

export type AssetRow = {
  id: string;
  smart_qr_unit_id: string;
  asset_type: "svg" | "png" | "stl" | "notes" | "package";
  filename: string;
  content_type: string;
  byte_size: number;
  version: number;
};
