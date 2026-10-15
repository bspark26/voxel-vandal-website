import type { ProductionStatus, UnitStatus } from "./types";

export function resolveScanStatus(
  requestedStatus: UnitStatus,
  destinationUrl: string | null,
  productionStatus: ProductionStatus,
): UnitStatus {
  if (!destinationUrl) return "draft";
  if (productionStatus !== "ready") return "paused";
  return requestedStatus;
}
