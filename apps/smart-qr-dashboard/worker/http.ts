export function json(
  body: unknown,
  init: ResponseInit | number = 200,
): Response {
  const responseInit =
    typeof init === "number" ? { status: init } : { ...init };
  const headers = new Headers(responseInit.headers);
  headers.set("Cache-Control", "no-store");
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(JSON.stringify(body), { ...responseInit, headers });
}

export function error(message: string, status = 400): Response {
  return json({ error: message }, status);
}

export async function readJson<T>(request: Request): Promise<T> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error("Expected a JSON request.");
  }
  return (await request.json()) as T;
}

