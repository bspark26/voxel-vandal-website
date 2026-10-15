export type SmartQrStatus = "draft" | "active" | "paused" | "retired";

export type SmartQrUnit = {
  unitNumber: string;
  publicToken: string;
  destinationUrl: string | null;
  status: SmartQrStatus;
};

export interface RedirectStore {
  findByPublicToken(token: string): Promise<SmartQrUnit | null>;
  healthcheck(): Promise<boolean>;
}

