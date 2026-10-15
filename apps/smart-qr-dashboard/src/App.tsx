import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import {
  createOrganization,
  createUnit,
  getAdminSession,
  getOrganization,
  listOrganizations,
  regenerateUnit,
  updateUnit,
  updateProductionStatus,
} from "./api";
import { generateAndStoreAssets } from "./manufacturing";
import type {
  Organization,
  OrganizationSummary,
  SmartQrUnit,
  AdminSession,
} from "./types";

type AddUnitForm = {
  displayName: string;
  destinationUrl: string;
  plateSizeMm: number;
};

const emptyUnitForm: AddUnitForm = {
  displayName: "",
  destinationUrl: "",
  plateSizeMm: 90,
};

function completeWebAddress(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (/^http:\/\//i.test(trimmed)) {
    return `https://${trimmed.slice("http://".length)}`;
  }
  if (!/^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

function formatBytes(bytes: number): string {
  if (bytes < 1_000_000) return `${Math.max(1, Math.round(bytes / 1000))} KB`;
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}

function assetLabel(type: string): string {
  return type === "package" ? "ZIP package" : type.toUpperCase();
}

function App() {
  const [organizations, setOrganizations] = useState<OrganizationSummary[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [addUnitOpen, setAddUnitOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [unitForm, setUnitForm] = useState<AddUnitForm>(emptyUnitForm);
  const [editing, setEditing] = useState<SmartQrUnit | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [unitSearch, setUnitSearch] = useState("");
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);

  const refreshOrganizations = useCallback(async (preferredId?: string) => {
    const next = await listOrganizations();
    setOrganizations(next);
    setSelectedId(
      (current) => preferredId ?? (current || next[0]?.id || ""),
    );
  }, []);

  const refreshSelected = useCallback(async (id: string) => {
    if (!id) {
      setOrganization(null);
      return;
    }
    setOrganization(await getOrganization(id));
  }, []);

  useEffect(() => {
    Promise.all([refreshOrganizations(), getAdminSession()])
      .then(([, session]) => setAdminSession(session))
      .catch((cause) => setError(String(cause)))
      .finally(() => setLoading(false));
  }, [refreshOrganizations]);

  useEffect(() => {
    if (!selectedId) return;
    setUnitSearch("");
    setLoading(true);
    refreshSelected(selectedId)
      .catch((cause) => setError(String(cause)))
      .finally(() => setLoading(false));
  }, [refreshSelected, selectedId]);

  useEffect(() => {
    function closeFileMenus(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      document
        .querySelectorAll<HTMLDetailsElement>(".unit-actions details[open]")
        .forEach((menu) => {
          if (!menu.contains(target)) menu.removeAttribute("open");
        });
    }

    document.addEventListener("pointerdown", closeFileMenus);
    return () => document.removeEventListener("pointerdown", closeFileMenus);
  }, []);

  const selectedSummary = useMemo(
    () => organizations.find((item) => item.id === selectedId),
    [organizations, selectedId],
  );
  const filteredOrganizations = useMemo(() => {
    const query = customerSearch.trim().toLowerCase();
    if (!query) return organizations;
    return organizations.filter((item) =>
      item.name.toLowerCase().includes(query),
    );
  }, [customerSearch, organizations]);
  const filteredUnits = useMemo(() => {
    if (!organization) return [];
    const query = unitSearch.trim().toLowerCase();
    if (!query) return organization.units;
    return organization.units.filter((unit) =>
      [
        unit.unitNumber,
        unit.displayName,
        unit.permanentUrl,
        unit.destinationUrl,
        unit.productionStatus,
      ].some((value) => value?.toLowerCase().includes(query)),
    );
  }, [organization, unitSearch]);

  async function addCustomer(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy("customer");
    try {
      const created = await createOrganization(customerName);
      await refreshOrganizations(created.id);
      setCustomerName("");
      setAddCustomerOpen(false);
      setNotice(`${created.name} was added.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy("");
    }
  }

  async function addUnit(event: FormEvent) {
    event.preventDefault();
    if (!organization) return;
    setError("");
    setNotice("");
    setBusy("unit");
    try {
      const created = await createUnit(organization.id, unitForm);
      setBusy("files");
      await generateAndStoreAssets(created);
      await Promise.all([
        refreshSelected(organization.id),
        refreshOrganizations(organization.id),
      ]);
      setUnitForm(emptyUnitForm);
      setAddUnitOpen(false);
      setNotice(
        `${created.unitNumber} was created and its production files were saved.`,
      );
    } catch (cause) {
      await refreshSelected(organization.id);
      setError(
        cause instanceof Error
          ? `${cause.message} The reserved unit remains saved so it can be recovered.`
          : String(cause),
      );
    } finally {
      setBusy("");
    }
  }

  async function saveUnit(event: FormEvent) {
    event.preventDefault();
    if (!editing || !organization) return;
    setBusy(`edit:${editing.id}`);
    setError("");
    try {
      await updateUnit(editing.id, {
        displayName: editing.displayName ?? "",
        destinationUrl: editing.destinationUrl ?? "",
        status: editing.status,
      });
      await refreshSelected(organization.id);
      setEditing(null);
      setNotice(`${editing.unitNumber} was updated. Its permanent URL did not change.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy("");
    }
  }

  async function changeUnitEnabled(
    unit: SmartQrUnit,
    enabled: boolean,
  ) {
    if (!organization || enabled === (unit.status === "active")) return;
    if (enabled && unit.productionStatus !== "ready") {
      setError(
        "Mark this display Ready to manage after printing and scan-testing it.",
      );
      return;
    }
    if (enabled && !unit.destinationUrl) {
      setError("Add a destination URL before enabling this Smart QR.");
      return;
    }

    const status: SmartQrUnit["status"] = enabled
      ? "active"
      : unit.destinationUrl
        ? "paused"
        : "draft";
    setBusy(`status:${unit.id}`);
    setError("");
    setNotice("");
    try {
      await updateUnit(unit.id, {
        displayName: unit.displayName ?? "",
        destinationUrl: unit.destinationUrl ?? "",
        status,
      });
      await refreshSelected(organization.id);
      setNotice(
        enabled
          ? `${unit.unitNumber} is active. Scans are enabled.`
          : `${unit.unitNumber} is disabled. Scans will not open the destination.`,
      );
    } catch (cause) {
      await refreshSelected(organization.id);
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy("");
    }
  }

  async function changeProductionStatus(
    unit: SmartQrUnit,
    productionStatus: SmartQrUnit["productionStatus"],
  ) {
    if (!organization || productionStatus === unit.productionStatus) return;
    if (
      productionStatus === "in_production" &&
      unit.status === "active" &&
      !window.confirm(
        `${unit.unitNumber} is currently enabled. Moving it back into production will disable scans. Continue?`,
      )
    ) {
      return;
    }

    setBusy(`production:${unit.id}`);
    setError("");
    setNotice("");
    try {
      await updateProductionStatus(unit.id, productionStatus);
      await refreshSelected(organization.id);
      setNotice(
        productionStatus === "ready"
          ? `${unit.unitNumber} is ready to manage. Destination and scan controls are unlocked.`
          : `${unit.unitNumber} is in production. Scans are disabled.`,
      );
    } catch (cause) {
      await refreshSelected(organization.id);
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy("");
    }
  }

  async function regenerate(unit: SmartQrUnit) {
    if (!organization) return;
    if (
      !window.confirm(
        `Regenerate production files for ${unit.unitNumber}? This will create a new saved version of every manufacturing file.`,
      )
    ) {
      return;
    }
    setBusy(`regen:${unit.id}`);
    setError("");
    setNotice("");
    try {
      const version = await regenerateUnit(unit.id);
      await generateAndStoreAssets(version);
      await refreshSelected(organization.id);
      setNotice(
        `${unit.unitNumber} production files were regenerated as version ${version.assetVersion}.`,
      );
    } catch (cause) {
      await refreshSelected(organization.id);
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy("");
    }
  }

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    setNotice("Permanent URL copied.");
  }

  function testDestination(value: string) {
    const completed = completeWebAddress(value);
    try {
      const url = new URL(completed);
      if (url.protocol !== "https:" || !url.hostname.includes(".")) {
        throw new Error();
      }
      window.open(url.toString(), "_blank", "noopener,noreferrer");
    } catch {
      setError("Enter a valid web address before testing the destination.");
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">VV</div>
          <div>
            <strong>VOXEL VANDAL</strong>
            <span>Internal operations</span>
          </div>
        </div>

        <div className="side-heading">
          <span>Customer accounts</span>
          <span>{organizations.length}</span>
        </div>
        <label className="search-box customer-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={customerSearch}
            onChange={(event) => setCustomerSearch(event.target.value)}
            placeholder="Search customers"
            aria-label="Search customers"
          />
        </label>
        <nav className="customer-list" aria-label="Customer accounts">
          {filteredOrganizations.map((item) => (
            <button
              className={item.id === selectedId ? "customer active" : "customer"}
              key={item.id}
              onClick={() => setSelectedId(item.id)}
            >
              <span className="avatar">{item.name.slice(0, 2).toUpperCase()}</span>
              <span>
                <strong>{item.name}</strong>
                <small>{item.unitCount} Smart QR{item.unitCount === 1 ? "" : "s"}</small>
              </span>
            </button>
          ))}
          {organizations.length > 0 && filteredOrganizations.length === 0 && (
            <span className="no-search-results">No matching customers</span>
          )}
        </nav>
        <button className="secondary full" onClick={() => setAddCustomerOpen(true)}>
          + Add customer
        </button>
        <div className="local-lock">
          <span>●</span>
          {adminSession?.mode === "cloudflare-access"
            ? "Authenticated admin"
            : "Local admin mode"}
          <small>
            {adminSession?.mode === "cloudflare-access"
              ? adminSession.email
              : "Not publicly accessible"}
          </small>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div>
            <p>VOXEL VANDAL ADMIN</p>
            <h1>{selectedSummary?.name ?? "Smart QR customers"}</h1>
          </div>
          {organization && (
            <button className="primary" onClick={() => setAddUnitOpen(true)}>
              + Add Smart QR
            </button>
          )}
        </header>

        <section className="content">
          {notice && <div className="notice success">{notice}</div>}
          {error && <div className="notice error">{error}</div>}

          {loading && !organization ? (
            <div className="empty">Loading customer accounts…</div>
          ) : !organization ? (
            <div className="empty">
              <span>01</span>
              <h2>Add your first customer account</h2>
              <p>Smart QR units and their production files stay organized by customer.</p>
              <button className="primary" onClick={() => setAddCustomerOpen(true)}>
                Add customer
              </button>
            </div>
          ) : (
            <>
              <div className="account-strip">
                <div>
                  <small>ACCOUNT STATUS</small>
                  <strong>{organization.accountStatus}</strong>
                </div>
                <div>
                  <small>SMART QR UNITS</small>
                  <strong>{organization.units.length}</strong>
                </div>
                <div>
                  <small>READY TO MANAGE</small>
                  <strong>
                    {organization.units.filter((unit) => unit.productionStatus === "ready").length}
                  </strong>
                </div>
              </div>

              <div className="section-heading">
                <div>
                  <p>OWNED UNITS</p>
                  <h2>Smart QR displays</h2>
                </div>
                <div className="unit-tools">
                  <span>
                    {filteredUnits.length} of {organization.units.length} units
                  </span>
                  <label className="search-box unit-search">
                    <span aria-hidden="true">⌕</span>
                    <input
                      type="search"
                      value={unitSearch}
                      onChange={(event) => setUnitSearch(event.target.value)}
                      placeholder="Search Smart QR units"
                      aria-label="Search Smart QR units"
                    />
                  </label>
                </div>
              </div>

              {organization.units.length === 0 ? (
                <div className="empty compact">
                  <h2>No Smart QR units yet</h2>
                  <p>Generate one when this customer’s first display is ready.</p>
                  <button className="primary" onClick={() => setAddUnitOpen(true)}>
                    Add Smart QR
                  </button>
                </div>
              ) : filteredUnits.length === 0 ? (
                <div className="empty compact search-empty">
                  <h2>No matching Smart QR units</h2>
                  <p>Try a display name, unit number, permanent URL or destination.</p>
                  <button className="secondary" onClick={() => setUnitSearch("")}>
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="unit-list">
                  {filteredUnits.map((unit) => {
                    const preview = unit.assets.find((asset) => asset.type === "png");
                    return (
                      <article className="unit-card" key={unit.id}>
                        <div className="preview">
                          {preview ? (
                            <img
                              src={`${preview.downloadUrl}?inline=1`}
                              alt={`${unit.unitNumber} QR preview`}
                            />
                          ) : (
                            <span>{unit.manufacturingStatus === "failed" ? "!" : "…"}</span>
                          )}
                        </div>
                        <div className="unit-main">
                          <div className="unit-title">
                            <div>
                              <span className="unit-number">{unit.unitNumber}</span>
                              <h3>{unit.displayName || "Untitled Smart QR"}</h3>
                            </div>
                            <div className="unit-controls">
                              <label
                                className={`production-control ${unit.productionStatus}`}
                              >
                                <span>PHYSICAL DISPLAY</span>
                                <select
                                  aria-label={`Production status for ${unit.unitNumber}`}
                                  value={unit.productionStatus}
                                  disabled={busy === `production:${unit.id}`}
                                  onChange={(event) =>
                                    changeProductionStatus(
                                      unit,
                                      event.target
                                        .value as SmartQrUnit["productionStatus"],
                                    )
                                  }
                                >
                                  <option value="in_production">In production</option>
                                  <option value="ready">Ready to manage</option>
                                </select>
                              </label>
                              <label
                                className={`status-control ${
                                  unit.status === "active" ? "enabled" : "disabled"
                                }`}
                              >
                                <span>QR STATUS</span>
                                <select
                                  aria-label={`Status for ${unit.unitNumber}`}
                                  value={unit.status === "active" ? "enabled" : "disabled"}
                                  disabled={
                                    busy === `status:${unit.id}` ||
                                    unit.productionStatus !== "ready"
                                  }
                                  title={
                                    unit.productionStatus === "ready"
                                      ? undefined
                                      : "Available after the physical display is marked Ready to manage"
                                  }
                                  onChange={(event) =>
                                    changeUnitEnabled(
                                      unit,
                                      event.target.value === "enabled",
                                    )
                                  }
                                >
                                  <option value="enabled">Enabled</option>
                                  <option value="disabled">Disabled</option>
                                </select>
                              </label>
                              <div className="badges">
                                <span className="badge">{unit.plateSizeMm} mm</span>
                                <span className={`badge ${unit.manufacturingStatus}`}>
                                  {unit.manufacturingStatus === "ready"
                                    ? "files ready"
                                    : unit.manufacturingStatus}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="unit-details">
                            <div>
                              <small>PERMANENT URL</small>
                              <a href={unit.permanentUrl} target="_blank" rel="noreferrer">
                                {unit.permanentUrl}
                              </a>
                            </div>
                            <div className="destination-detail">
                              <small>DESTINATION</small>
                              <div className="destination-value">
                                <span className={!unit.destinationUrl ? "muted" : ""}>
                                  {unit.destinationUrl || "Not assigned"}
                                </span>
                                <button
                                  className="destination-button"
                                  onClick={() => setEditing({ ...unit })}
                                >
                                  {unit.destinationUrl ? "Change" : "Set destination"}
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="unit-actions">
                            <button className="text-button" onClick={() => copy(unit.permanentUrl)}>
                              Copy permanent URL
                            </button>
                            <details>
                              <summary>Production files</summary>
                              <div className="file-menu">
                                {unit.assets.length ? (
                                  unit.assets.map((asset) => (
                                    <a href={asset.downloadUrl} key={asset.id}>
                                      <span>{assetLabel(asset.type)}</span>
                                      <small>v{asset.version} · {formatBytes(asset.byteSize)}</small>
                                    </a>
                                  ))
                                ) : (
                                  <span>No saved files</span>
                                )}
                                <button
                                  onClick={() => regenerate(unit)}
                                  disabled={busy === `regen:${unit.id}`}
                                >
                                  {busy === `regen:${unit.id}` ? "Regenerating…" : "Regenerate files"}
                                </button>
                              </div>
                            </details>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {addCustomerOpen && (
        <div className="modal-backdrop" role="presentation">
          <form className="modal" onSubmit={addCustomer}>
            <button className="close" type="button" onClick={() => setAddCustomerOpen(false)}>×</button>
            <p>NEW ACCOUNT</p>
            <h2>Add a customer</h2>
            <label>
              Customer or business name
              <input
                autoFocus
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Aspen Ridge Realty"
                maxLength={100}
                required
              />
            </label>
            <button className="primary full" disabled={busy === "customer"}>
              {busy === "customer" ? "Adding…" : "Add customer"}
            </button>
          </form>
        </div>
      )}

      {addUnitOpen && (
        <div className="modal-backdrop" role="presentation">
          <form className="modal" onSubmit={addUnit}>
            <button className="close" type="button" onClick={() => setAddUnitOpen(false)}>×</button>
            <p>NEW PHYSICAL UNIT</p>
            <h2>Add Smart QR</h2>
            <div className="warning">
              This reserves a permanent unit number and URL. Refreshing the page will not make another one.
            </div>
            <label>
              Display name
              <input
                autoFocus
                value={unitForm.displayName}
                onChange={(event) => setUnitForm({ ...unitForm, displayName: event.target.value })}
                placeholder="127 Aspen Drive"
                maxLength={100}
                required
              />
            </label>
            <label>
              Initial destination <span>optional</span>
              <input
                type="text"
                inputMode="url"
                value={unitForm.destinationUrl}
                onChange={(event) => setUnitForm({ ...unitForm, destinationUrl: event.target.value })}
                onBlur={(event) =>
                  setUnitForm({
                    ...unitForm,
                    destinationUrl: completeWebAddress(event.target.value),
                  })
                }
                placeholder="customer-site.com/listing"
              />
              <small className="field-help">
                Enter the website normally—we’ll add secure HTTPS automatically.
              </small>
              <button
                className="test-destination"
                type="button"
                disabled={!unitForm.destinationUrl.trim()}
                onClick={() => testDestination(unitForm.destinationUrl)}
              >
                Test URL ↗
              </button>
            </label>
            <label>
              Insert size
              <select
                value={unitForm.plateSizeMm}
                onChange={(event) => setUnitForm({ ...unitForm, plateSizeMm: Number(event.target.value) })}
              >
                <option value={60}>60 mm</option>
                <option value={90}>90 mm · standard</option>
              </select>
            </label>
            <button className="primary full" disabled={Boolean(busy)}>
              {busy === "unit"
                ? "Reserving permanent URL…"
                : busy === "files"
                  ? "Generating and saving files…"
                  : "Generate Smart QR"}
            </button>
          </form>
        </div>
      )}

      {editing && (
        <div className="modal-backdrop" role="presentation">
          <form className="modal" onSubmit={saveUnit}>
            <button className="close" type="button" onClick={() => setEditing(null)}>×</button>
            <p>{editing.unitNumber}</p>
            <h2>Edit Smart QR</h2>
            <div className="fixed-url">
              <small>PERMANENT PRINTED URL</small>
              <span>{editing.permanentUrl}</span>
            </div>
            <label>
              Display name
              <input
                value={editing.displayName ?? ""}
                onChange={(event) => setEditing({ ...editing, displayName: event.target.value })}
                required
              />
            </label>
            <label>
              Destination
              <input
                type="text"
                inputMode="url"
                value={editing.destinationUrl ?? ""}
                onChange={(event) => setEditing({ ...editing, destinationUrl: event.target.value })}
                onBlur={(event) =>
                  setEditing({
                    ...editing,
                    destinationUrl: completeWebAddress(event.target.value),
                  })
                }
                placeholder="customer-site.com/new-page"
              />
              <small className="field-help">
                Enter the website normally—we’ll add secure HTTPS automatically.
              </small>
              <button
                className="test-destination"
                type="button"
                disabled={!editing.destinationUrl?.trim()}
                onClick={() => testDestination(editing.destinationUrl ?? "")}
              >
                Test URL ↗
              </button>
            </label>
            <button className="primary full" disabled={busy === `edit:${editing.id}`}>
              {busy === `edit:${editing.id}` ? "Saving…" : "Save changes"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
