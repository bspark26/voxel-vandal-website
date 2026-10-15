import QRCode from "qrcode";

import type { QrMatrix } from "./types";

const TOKEN_ALPHABET =
  "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export function generateSecureToken(length = 12): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);

  return Array.from(
    bytes,
    (byte) => TOKEN_ALPHABET[byte % TOKEN_ALPHABET.length],
  ).join("");
}

export function createQrMatrix(
  value: string,
  errorCorrectionLevel: "Q" = "Q",
): QrMatrix {
  const qr = QRCode.create(value, { errorCorrectionLevel });
  const size = qr.modules.size;
  const cells = Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) =>
      Boolean(qr.modules.get(row, column)),
    ),
  );

  return { size, cells };
}

export function normalizeUnitNumber(value: string): string {
  const normalized = value.trim().toUpperCase().replace(/\s+/g, "-");

  if (!/^VV-\d{5}$/.test(normalized)) {
    throw new Error("Unit numbers must use the format VV-00001.");
  }

  return normalized;
}
