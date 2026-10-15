import { statusPage } from "./pages";
import type { RedirectStore, SmartQrUnit } from "./types";

const PUBLIC_TOKEN_PATTERN = /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{12}$/;

const commonHeaders = {
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow",
} as const;

function tokenFromPath(pathname: string): string | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length !== 1) return null;
  const token = parts[0];
  return token && PUBLIC_TOKEN_PATTERN.test(token) ? token : null;
}

function safeDestination(value: string | null): URL | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

function unitResponse(unit: SmartQrUnit): Response {
  if (unit.status === "paused") {
    return statusPage(
      "This display is paused.",
      "Its owner has temporarily paused this Smart QR destination. Please try again later.",
      200,
      unit.unitNumber,
    );
  }

  if (unit.status === "retired") {
    return statusPage(
      "This display has been retired.",
      "This Smart QR is no longer active. Contact Voxel Vandal if you believe this is an error.",
      410,
      unit.unitNumber,
    );
  }

  if (unit.status !== "active") {
    return statusPage(
      "This display is not active yet.",
      "The Smart QR has been created but does not have an active destination.",
      404,
      unit.unitNumber,
    );
  }

  const destination = safeDestination(unit.destinationUrl);
  if (!destination) {
    return statusPage(
      "This destination is unavailable.",
      "The Smart QR is active, but its destination needs attention. Please contact Voxel Vandal.",
      503,
      unit.unitNumber,
    );
  }

  return new Response(null, {
    status: 302,
    headers: {
      ...commonHeaders,
      Location: destination.toString(),
      "Content-Length": "0",
    },
  });
}

export async function handleRequest(
  request: Request,
  store: RedirectStore,
): Promise<Response> {
  const url = new URL(request.url);

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { ...commonHeaders, Allow: "GET, HEAD" },
    });
  }

  if (url.pathname === "/health") {
    try {
      const healthy = await store.healthcheck();
      return Response.json(
        { service: "smart-qr-redirect", status: healthy ? "ok" : "error" },
        {
          status: healthy ? 200 : 503,
          headers: commonHeaders,
        },
      );
    } catch {
      return Response.json(
        { service: "smart-qr-redirect", status: "error" },
        { status: 503, headers: commonHeaders },
      );
    }
  }

  if (url.pathname === "/") {
    return statusPage(
      "Smart QR is online.",
      "This domain powers permanent, programmable QR displays created by Voxel Vandal.",
      200,
    );
  }

  const token = tokenFromPath(url.pathname);
  if (!token) {
    return statusPage(
      "Smart QR not found.",
      "This code is invalid or does not exist.",
      404,
    );
  }

  try {
    const unit = await store.findByPublicToken(token);
    if (!unit) {
      return statusPage(
        "Smart QR not found.",
        "This code is invalid or does not exist.",
        404,
      );
    }

    return unitResponse(unit);
  } catch {
    return statusPage(
      "The destination is temporarily unavailable.",
      "Please wait a moment and scan this Smart QR again.",
      503,
    );
  }
}
