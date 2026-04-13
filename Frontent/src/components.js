// ─── components.js ───────────────────────────────────────────────
// Shared reusable UI pieces used across all modules
// ─────────────────────────────────────────────────────────────────

import React from "react";

// ── Color tokens ──────────────────────────────────────────────────
export const C = {
  bg:       "#0d0d1a",
  surface:  "#13132a",
  border:   "#1e1e3a",
  border2:  "#2d2d4e",
  text:     "#e8e0ff",
  muted:    "#9990cc",
  dim:      "#444",
  purple:   "#7c6af0",
  purpleD:  "#5a4fd0",
  green:    "#30c8a0",
  greenD:   "#1fa880",
  amber:    "#ffb432",
  red:      "#ff5555",
  money:    "#a0f0a0",
};

// ── SVG Icons ─────────────────────────────────────────────────────
export const Icon = {
  Product: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  ),
  Customer: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  POS: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  Bills: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Add:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Edit:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Print:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Cart:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  X:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
};

// ── Modal ─────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, width = "460px" }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(10,10,20,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, backdropFilter: "blur(6px)",
    }}>
      <div style={{
        background: C.surface, border: `1px solid ${C.border2}`,
        borderRadius: "18px", padding: "28px", width, maxWidth: "94vw",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        animation: "popIn 0.18s ease",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
          <h3 style={{ color: C.text, fontSize: "16px", fontWeight: 700, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.04)", border: "none", color: "#666",
            cursor: "pointer", borderRadius: "8px", padding: "6px", display: "flex",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,80,80,0.15)"; e.currentTarget.style.color = C.red; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#666"; }}>
            <Icon.X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Input Field ───────────────────────────────────────────────────
export function Field({ label, type = "text", value, onChange, placeholder, required, error }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={{ display: "block", color: C.muted, fontSize: "12px", fontWeight: 600, marginBottom: "6px", letterSpacing: "0.4px" }}>
        {label} {required && <span style={{ color: "#ff7755" }}>*</span>}
      </label>
      <input type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", background: "rgba(255,255,255,0.04)",
          border: `1px solid ${error ? C.red : C.border2}`,
          borderRadius: "10px", padding: "10px 14px", color: C.text,
          fontSize: "14px", outline: "none", transition: "border-color 0.15s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderColor = C.purple)}
        onBlur={(e)  => (e.target.style.borderColor = error ? C.red : C.border2)}
      />
      {error && <div style={{ color: C.red, fontSize: "11px", marginTop: "4px" }}>{error}</div>}
    </div>
  );
}

// ── Button ────────────────────────────────────────────────────────
export function Btn({ children, onClick, color = "purple", size = "md", disabled, fullWidth, outline, style: extra = {} }) {
  const colors = {
    purple: { bg: `linear-gradient(135deg,${C.purple},${C.purpleD})`, text: "#fff" },
    green:  { bg: `linear-gradient(135deg,${C.green},${C.greenD})`,   text: "#fff" },
    amber:  { bg: `linear-gradient(135deg,#f0a040,#c07818)`,          text: "#fff" },
    red:    { bg: `linear-gradient(135deg,#e05050,#b03030)`,          text: "#fff" },
    ghost:  { bg: "rgba(255,255,255,0.05)", text: "#888", border: `1px solid ${C.border2}` },
  };
  const sz = { sm: "7px 14px", md: "10px 20px", lg: "13px 28px" };
  const { bg, text, border } = colors[color] || colors.purple;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        background: outline ? "transparent" : bg,
        border: outline ? `1px solid ${C.purple}` : (border || "none"),
        color: outline ? C.purple : text,
        borderRadius: "10px", padding: sz[size], cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1, fontSize: size === "sm" ? "12px" : "14px",
        fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px",
        width: fullWidth ? "100%" : "auto", justifyContent: "center",
        transition: "opacity 0.15s, transform 0.1s",
        ...extra,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.opacity = "0.88"; }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
      {children}
    </button>
  );
}

// ── Badge ─────────────────────────────────────────────────────────
export function Badge({ children, color = C.purple }) {
  return (
    <span style={{
      background: `${color}22`, color, borderRadius: "20px",
      padding: "2px 10px", fontSize: "12px", fontWeight: 600,
    }}>{children}</span>
  );
}

// ── Search Bar ────────────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder = "Search...", width = "280px" }) {
  return (
    <div style={{ position: "relative", width }}>
      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#555", pointerEvents: "none" }}>
        <Icon.Search />
      </span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{
          width: "100%", paddingLeft: "38px", background: "rgba(255,255,255,0.04)",
          border: `1px solid ${C.border2}`, borderRadius: "10px",
          padding: "10px 14px 10px 38px", color: C.text, fontSize: "14px", outline: "none",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderColor = C.purple)}
        onBlur={(e)  => (e.target.style.borderColor = C.border2)}
      />
    </div>
  );
}

// ── Data Table ────────────────────────────────────────────────────
export function Table({ columns, rows, accent = C.purple, emptyText = "No data found" }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.015)", borderRadius: "14px", border: `1px solid ${C.border}`, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: `${accent}12`, borderBottom: `1px solid ${C.border2}` }}>
            {columns.map((col) => (
              <th key={col.key} style={{ padding: "12px 16px", textAlign: "left", color: accent, fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ textAlign: "center", padding: "48px", color: C.dim }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🗃️</div>
              <div>{emptyText}</div>
            </td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, transition: "background 0.12s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = `${accent}08`)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              {columns.map((col) => (
                <td key={col.key} style={{ padding: "12px 16px", color: C.text, fontSize: "13px" }}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Toast / Notification ──────────────────────────────────────────
export function Toast({ message, type = "success", onDone }) {
  React.useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  const colors = { success: C.green, error: C.red, info: C.purple };
  return (
    <div style={{
      position: "fixed", bottom: "28px", right: "28px", zIndex: 9999,
      background: C.surface, border: `1px solid ${colors[type]}55`,
      borderLeft: `4px solid ${colors[type]}`, borderRadius: "12px",
      padding: "14px 20px", color: C.text, fontSize: "14px", fontWeight: 500,
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)", animation: "slideUp 0.25s ease",
      display: "flex", alignItems: "center", gap: "10px", maxWidth: "360px",
    }}>
      <span style={{ color: colors[type], fontSize: "18px" }}>
        {type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}
      </span>
      {message}
    </div>
  );
}

// ── Loading Spinner ───────────────────────────────────────────────
export function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
      <div style={{
        width: "36px", height: "36px", borderRadius: "50%",
        border: `3px solid ${C.border2}`, borderTopColor: C.purple,
        animation: "spin 0.7s linear infinite",
      }} />
    </div>
  );
}

// ── Global CSS injector ───────────────────────────────────────────
export function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
      * { box-sizing: border-box; }
      body { margin:0; font-family:'DM Sans',system-ui,sans-serif; background:${C.bg}; color:${C.text}; }
      ::-webkit-scrollbar { width:6px; height:6px; }
      ::-webkit-scrollbar-track { background:#111; }
      ::-webkit-scrollbar-thumb { background:${C.border2}; border-radius:4px; }
      ::-webkit-scrollbar-thumb:hover { background:${C.purple}88; }
      @keyframes popIn    { from { opacity:0; transform:scale(0.95) translateY(-8px); } to { opacity:1; transform:scale(1) translateY(0); } }
      @keyframes slideUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
      @keyframes spin     { to { transform: rotate(360deg); } }
      input, button { font-family: inherit; }
    `}</style>
  );
}
