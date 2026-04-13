import { useState } from "react";
import { GlobalStyles, C, Icon } from "./components";
import ProductModule  from "./ProductModule";
import CustomerModule from "./CustomerModule";
import POSModule      from "./POSModule";
import BillHistory    from "./BillHistory";

const TABS = [
  { id: "pos",       label: "POS / Billing",  icon: <Icon.POS />,      color: C.purple },
  { id: "products",  label: "Products",        icon: <Icon.Product />,  color: C.purple },
  { id: "customers", label: "Customers",       icon: <Icon.Customer />, color: C.green  },
  { id: "bills",     label: "Bill History",    icon: <Icon.Bills />,    color: C.amber  },
];

export default function App() {
  const [tab, setTab] = useState("pos");

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <GlobalStyles />

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header style={{
        background: "rgba(255,255,255,0.018)",
        borderBottom: `1px solid ${C.border}`,
        padding: "0 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "64px", position: "sticky", top: 0, zIndex: 100,
        backdropFilter: "blur(12px)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "12px",
            background: `linear-gradient(135deg,${C.purple},${C.purpleD})`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
            boxShadow: `0 0 20px ${C.purple}40`,
          }}>🛒</div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "17px", letterSpacing: "0.5px" }}>
               STORES
            </div>
            <div style={{ color: "#333", fontSize: "10px", letterSpacing: "1.5px", fontWeight: 600 }}>
              BILLING & POS SYSTEM
            </div>
          </div>
        </div>

        {/* Nav Tabs */}
        <nav style={{ display: "flex", gap: "4px" }}>
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  background: active ? `${t.color}18` : "transparent",
                  border: active ? `1px solid ${t.color}50` : "1px solid transparent",
                  color: active ? t.color : "#444",
                  borderRadius: "10px", padding: "8px 16px", cursor: "pointer",
                  fontSize: "13px", fontWeight: 600, transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.color = t.color; e.currentTarget.style.background = `${t.color}0a`; }}}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.color = "#444"; e.currentTarget.style.background = "transparent"; }}}>
                {t.icon} {t.label}
              </button>
            );
          })}
        </nav>

        {/* Clock */}
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#444", fontSize: "12px" }}>{dateStr}</div>
          <div style={{ color: C.purple, fontSize: "13px", fontWeight: 700, fontFamily: "monospace" }}>{timeStr}</div>
        </div>
      </header>

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div style={{ padding: "24px 28px 0" }}>
        <div style={{ marginBottom: "20px" }}>
          {{
            pos:       <><h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "24px", margin: "0 0 4px" }}>🧾 Point of Sale</h2><p style={{ color: C.dim, margin: 0, fontSize: "13px" }}>Create bills, add products, and generate printable thermal receipts</p></>,
            products:  <><h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "24px", margin: "0 0 4px" }}>📦 Product Master</h2><p style={{ color: C.dim, margin: 0, fontSize: "13px" }}>Manage inventory, pricing, GST rates and barcodes</p></>,
            customers: <><h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "24px", margin: "0 0 4px" }}>👥 Customer Master</h2><p style={{ color: C.dim, margin: 0, fontSize: "13px" }}>Manage customer profiles, contact info and addresses</p></>,
            bills:     <><h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "24px", margin: "0 0 4px" }}>📋 Bill History</h2><p style={{ color: C.dim, margin: 0, fontSize: "13px" }}>View all saved bills and reprint receipts</p></>,
          }[tab]}
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <main style={{ padding: "0 28px 40px" }}>
        {tab === "pos"       && <POSModule />}
        {tab === "products"  && <ProductModule />}
        {tab === "customers" && <CustomerModule />}
        {tab === "bills"     && <BillHistory />}
      </main>
    </div>
  );
}
