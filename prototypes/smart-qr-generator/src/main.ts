import "./styles.css";

import {
  buildManufacturingArtifacts,
  buildProductionPackage,
  drawManufacturingPreview,
  generateSecureToken,
  getScaledPlanarGeometry,
  type ManufacturingArtifacts,
} from "@voxel-vandal/smart-qr-manufacturing";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("App container was not found.");

app.innerHTML = `
  <header class="site-header">
    <a class="brand" href="#" aria-label="Voxel Vandal Smart QR generator">
      <span class="brand-mark">VV</span>
      <span>VOXEL <strong>VANDAL</strong></span>
    </a>
    <span class="prototype-pill">Manufacturing prototype</span>
  </header>

  <main>
    <section class="intro">
      <p class="eyebrow"><span></span> Phase 1 · QR production proof</p>
      <h1>Generate the permanent code.<br/><em>Print it once.</em></h1>
      <p>
        This prototype creates one permanent, glue-in Smart QR insert and
        packages its SVG, combined STL and scan-test preview. It does not create
        the stand or change the live Voxel Vandal website.
      </p>
    </section>

    <div class="workspace">
      <section class="panel controls-panel" aria-labelledby="setup-heading">
        <div class="panel-heading">
          <div>
            <span class="step">01</span>
            <h2 id="setup-heading">Unit setup</h2>
          </div>
          <span class="status-dot">Ready</span>
        </div>

        <form id="generator-form">
          <label>
            Unit number
            <input id="unit-number" name="unitNumber" value="VV-00001" pattern="VV-[0-9]{5}" required />
            <small>Production identity for this physical unit.</small>
          </label>

          <label>
            Permanent QR address
            <div class="compound-input">
              <span>q.voxelvandal.com/</span>
              <input id="token" name="token" autocomplete="off" required />
              <button id="refresh-token" class="icon-button" type="button" title="Generate a new secure token" aria-label="Generate a new secure token">↻</button>
            </div>
            <small>This address is encoded permanently; customer destinations are not.</small>
          </label>

          <label>
            Plate size
            <select id="plate-size" name="plateSize">
              <option value="60">60 mm · close range</option>
              <option value="90" selected>90 mm · standard</option>
            </select>
          </label>

          <div class="spec-grid">
            <div><span>White insert</span><strong>2.4 mm</strong></div>
            <div><span>Raised QR</span><strong>2.0 mm</strong></div>
            <div><span>Nozzle</span><strong>0.4 mm</strong></div>
            <div><span>Layer</span><strong>0.2 mm</strong></div>
          </div>

          <button id="generate-button" class="primary-button" type="submit">
            <span class="button-label">Generate production files</span>
            <span>↓</span>
          </button>
        </form>

        <div id="success-message" class="message success-message" role="status" hidden></div>
        <div id="error-message" class="message error-message" role="alert" hidden></div>
      </section>

      <section class="panel preview-panel" aria-labelledby="preview-heading">
        <div class="panel-heading">
          <div>
            <span class="step">02</span>
            <h2 id="preview-heading">Production preview</h2>
          </div>
          <span id="matrix-size" class="matrix-size">—</span>
        </div>

        <div class="preview-stage">
          <canvas id="qr-preview" aria-label="Generated Smart QR preview"></canvas>
          <span class="dimension dimension-top" id="dimension-top">90 mm</span>
          <span class="dimension dimension-side" id="dimension-side">90 mm</span>
        </div>

        <dl class="output-meta">
          <div><dt>Unit</dt><dd id="output-unit">VV-00001</dd></div>
          <div><dt>Permanent URL</dt><dd id="output-url">—</dd></div>
          <div><dt>Print orientation</dt><dd>Face-up</dd></div>
          <div><dt>Material assignment</dt><dd>White insert / black QR</dd></div>
        </dl>
      </section>
    </div>

    <section class="panel downloads-panel" aria-labelledby="downloads-heading">
      <div class="panel-heading">
        <div>
          <span class="step">03</span>
          <h2 id="downloads-heading">Manufacturing package</h2>
        </div>
        <span id="package-status">Generate a unit to enable downloads</span>
      </div>

      <div class="downloads">
        <button type="button" data-download="svg" disabled><strong>SVG</strong><span>Vector artwork</span></button>
        <button type="button" data-download="png" disabled><strong>PNG</strong><span>Scan-test preview</span></button>
        <button type="button" data-download="combined-stl" disabled><strong>STL</strong><span>Complete insert</span></button>
        <button class="package-button" type="button" data-download="package" disabled><strong>ZIP</strong><span>Complete production package</span></button>
      </div>
    </section>

    <aside class="prototype-note">
      <span>Important</span>
      <p>
        The generated URL will not redirect until Phase 2 connects
        <strong>q.voxelvandal.com</strong> to the redirect service. The QR geometry
        is production-oriented, but the first print must be physically scan-tested
        before these dimensions are locked.
      </p>
    </aside>
  </main>
`;

const form = document.querySelector<HTMLFormElement>("#generator-form")!;
const unitNumberInput =
  document.querySelector<HTMLInputElement>("#unit-number")!;
const tokenInput = document.querySelector<HTMLInputElement>("#token")!;
const plateSizeInput =
  document.querySelector<HTMLSelectElement>("#plate-size")!;
const refreshTokenButton =
  document.querySelector<HTMLButtonElement>("#refresh-token")!;
const preview = document.querySelector<HTMLCanvasElement>("#qr-preview")!;
const errorMessage =
  document.querySelector<HTMLDivElement>("#error-message")!;
const successMessage =
  document.querySelector<HTMLDivElement>("#success-message")!;
const packageStatus =
  document.querySelector<HTMLSpanElement>("#package-status")!;
const generateButton =
  document.querySelector<HTMLButtonElement>("#generate-button")!;
const generateButtonLabel =
  generateButton.querySelector<HTMLSpanElement>(".button-label")!;

let artifacts: ManufacturingArtifacts | undefined;

function filename(suffix: string): string {
  return `${artifacts?.spec.unitNumber.toLowerCase() ?? "smart-qr"}${suffix}`;
}

function downloadBlob(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

function bytesBlob(bytes: Uint8Array, type: string): Blob {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new Blob([copy.buffer], { type });
}

function canvasPng(): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    preview.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error("Could not create the PNG preview."));
        return;
      }
      resolve(new Uint8Array(await blob.arrayBuffer()));
    }, "image/png");
  });
}

function setDownloadState(enabled: boolean): void {
  document
    .querySelectorAll<HTMLButtonElement>("[data-download]")
    .forEach((button) => {
      button.disabled = !enabled;
    });
}

function renderArtifacts(nextArtifacts: ManufacturingArtifacts): void {
  artifacts = nextArtifacts;
  drawManufacturingPreview(preview, artifacts.matrix, artifacts.spec);
  const previewScale = artifacts.spec.plateSizeMm / 90;
  const previewWidth = `min(${68 * previewScale}%, ${390 * previewScale}px)`;
  preview.style.width = previewWidth;
  const topDimension = document.querySelector<HTMLElement>("#dimension-top")!;
  topDimension.style.width = previewWidth;
  topDimension.style.maxWidth = `${390 * previewScale}px`;
  document.querySelector("#output-unit")!.textContent =
    artifacts.spec.unitNumber;
  document.querySelector("#output-url")!.textContent =
    artifacts.spec.redirectUrl;
  document.querySelector("#matrix-size")!.textContent =
    `${artifacts.matrix.size} × ${artifacts.matrix.size} modules`;
  document.querySelector("#dimension-top")!.textContent =
    `${artifacts.spec.plateSizeMm} mm`;
  document.querySelector("#dimension-side")!.textContent =
    `${artifacts.spec.plateSizeMm} mm`;
  packageStatus.textContent = `${artifacts.spec.unitNumber} is ready`;
  errorMessage.hidden = true;
  setDownloadState(true);
}

function generate(): ManufacturingArtifacts | undefined {
  try {
    const plateSizeMm = Number(plateSizeInput.value);
    const redirectUrl = `https://q.voxelvandal.com/${tokenInput.value.trim()}`;
    const nextArtifacts = buildManufacturingArtifacts({
      unitNumber: unitNumberInput.value,
      redirectUrl,
      plateSizeMm,
      ...getScaledPlanarGeometry(plateSizeMm),
    });
    renderArtifacts(nextArtifacts);
    return nextArtifacts;
  } catch (error) {
    artifacts = undefined;
    setDownloadState(false);
    packageStatus.textContent = "Generation failed";
    errorMessage.textContent =
      error instanceof Error ? error.message : "Could not generate the unit.";
    errorMessage.hidden = false;
    successMessage.hidden = true;
    return undefined;
  }
}

refreshTokenButton.addEventListener("click", () => {
  tokenInput.value = generateSecureToken();
  generate();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  generateButton.disabled = true;
  generateButtonLabel.textContent = "Building production package…";
  successMessage.hidden = true;

  const nextArtifacts = generate();
  if (!nextArtifacts) {
    generateButton.disabled = false;
    generateButtonLabel.textContent = "Generate production files";
    return;
  }

  try {
    const packageBytes = buildProductionPackage(
      nextArtifacts,
      await canvasPng(),
    );
    downloadBlob(
      bytesBlob(packageBytes, "application/zip"),
      `${nextArtifacts.spec.unitNumber.toLowerCase()}-production-package.zip`,
    );
    successMessage.textContent = `${nextArtifacts.spec.unitNumber} was generated. The complete production ZIP has been downloaded.`;
    successMessage.hidden = false;
    packageStatus.textContent = `${nextArtifacts.spec.unitNumber} downloaded`;
  } catch (error) {
    errorMessage.textContent =
      error instanceof Error
        ? error.message
        : "The production package could not be downloaded.";
    errorMessage.hidden = false;
  } finally {
    generateButton.disabled = false;
    generateButtonLabel.textContent = "Generate production files";
  }
});

document
  .querySelector(".downloads")
  ?.addEventListener("click", async (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
      "[data-download]",
    );
    if (!button || !artifacts) return;

    const type = button.dataset.download;
    if (type === "svg") {
      downloadBlob(
        new Blob([artifacts.svg], { type: "image/svg+xml" }),
        filename(".svg"),
      );
    } else if (type === "png") {
      downloadBlob(
        bytesBlob(await canvasPng(), "image/png"),
        filename("-preview.png"),
      );
    } else if (type === "combined-stl") {
      downloadBlob(
        bytesBlob(artifacts.combinedStl, "model/stl"),
        filename("-complete-qr-insert.stl"),
      );
    } else if (type === "package") {
      const packageBytes = buildProductionPackage(
        artifacts,
        await canvasPng(),
      );
      downloadBlob(
        bytesBlob(packageBytes, "application/zip"),
        filename("-production-package.zip"),
      );
    }
  });

tokenInput.value = generateSecureToken();
generate();
