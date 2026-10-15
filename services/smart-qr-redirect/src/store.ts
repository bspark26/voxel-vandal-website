import type { RedirectStore, SmartQrStatus, SmartQrUnit } from "./types";

type SmartQrRow = {
  unit_number: string;
  public_token: string;
  destination_url: string | null;
  status: SmartQrStatus;
};

export class D1RedirectStore implements RedirectStore {
  constructor(private readonly database: D1Database) {}

  async findByPublicToken(token: string): Promise<SmartQrUnit | null> {
    const row = await this.database
      .prepare(
        `SELECT unit_number, public_token, destination_url, status
         FROM smart_qr_units
         WHERE public_token = ?1
         LIMIT 1`,
      )
      .bind(token)
      .first<SmartQrRow>();

    if (!row) return null;

    return {
      unitNumber: row.unit_number,
      publicToken: row.public_token,
      destinationUrl: row.destination_url,
      status: row.status,
    };
  }

  async healthcheck(): Promise<boolean> {
    const result = await this.database
      .prepare("SELECT 1 AS healthy")
      .first<{ healthy: number }>();

    return result?.healthy === 1;
  }
}

