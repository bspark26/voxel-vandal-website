const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export function statusPage(
  title: string,
  message: string,
  status: number,
  unitNumber?: string,
): Response {
  const safeUnit = unitNumber ? escapeHtml(unitNumber) : undefined;
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="robots" content="noindex,nofollow">
    <title>${escapeHtml(title)} · Voxel Vandal</title>
    <style>
      :root{color-scheme:dark;font-family:Inter,ui-sans-serif,system-ui,sans-serif;background:#060a07;color:#f5f7f5}
      *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 50% 20%,rgba(47,192,79,.1),transparent 34rem),#060a07}
      main{width:min(100%,560px);padding:42px;border:1px solid rgba(198,240,207,.14);border-radius:18px;background:#0c120e;box-shadow:0 30px 80px rgba(0,0,0,.3)}
      .brand{font-weight:900;letter-spacing:-.04em}.brand span{color:#2fc04f}
      .eyebrow{margin-top:52px;color:#2fc04f;font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase}
      h1{margin:12px 0 18px;font-size:clamp(36px,8vw,58px);line-height:1;letter-spacing:-.055em}
      p{margin:0;color:#a5b1a8;line-height:1.7}
      .unit{display:inline-block;margin-top:30px;border:1px solid rgba(47,192,79,.25);border-radius:999px;padding:8px 12px;color:#b8efc3;background:rgba(47,192,79,.07);font:700 11px ui-monospace,SFMono-Regular,Menlo,monospace}
      a{display:inline-block;margin-top:32px;color:#071008;background:#2fc04f;border-radius:8px;padding:13px 17px;text-decoration:none;font-weight:800}
    </style>
  </head>
  <body>
    <main>
      <div class="brand">VOXEL <span>VANDAL</span></div>
      <div class="eyebrow">Smart QR display</div>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(message)}</p>
      ${safeUnit ? `<div class="unit">${safeUnit}</div>` : ""}
      <br>
      <a href="https://voxelvandal.com/contact/">Contact Voxel Vandal</a>
    </main>
  </body>
</html>`;

  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Security-Policy":
        "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

