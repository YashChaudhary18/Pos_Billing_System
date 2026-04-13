import { useState, useEffect, useCallback } from "react";
import { billApi } from "./api";
import { printReceipt } from "./printReceipt";
import { C, Icon, Btn, Badge, SearchBar, Spinner, Toast } from "./components";

export default function BillHistory() {
  const [bills,   setBills]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [selected,setSelected]= useState(null);
  const [toast,   setToast]   = useState(null);

  const showToast = (msg, type = "success") => setToast({ message: msg, type });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await billApi.getAll();
      setBills(data);
    } catch (e) {
      showToast("Failed to load bills: " + e.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = bills.filter((b) => {
    const q = search.toLowerCase();
    return (
      String(b.id).includes(q) ||
      (b.customer?.name || "").toLowerCase().includes(q) ||
      (b.customer?.mobile || "").includes(q)
    );
  });

  const reprint = (bill) => {
    printReceipt(bill, bill.customer, bill.items || []);
  };

  const fmt = (isoDate) => {
    const d = new Date(isoDate);
    return { date: d.toLocaleDateString("en-IN"), time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) };
  };

  return (
    <div>
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by bill# or customer..." width="300px" />
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Badge color={C.purple}>{filtered.length} bills</Badge>
          <Btn size="sm" color="ghost" onClick={load}>↻ Refresh</Btn>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 340px" : "1fr", gap: "20px" }}>
          {/* Bill List */}
          <div style={{ background: "rgba(255,255,255,0.015)", borderRadius: "14px", border: `1px solid ${C.border}`, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: `${C.purple}12`, borderBottom: `1px solid ${C.border2}` }}>
                  {["Bill #", "Date & Time", "Customer", "Items", "Total", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: C.purple, fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: "center", padding: "48px", color: C.dim }}>
                    <div style={{ fontSize: "32px" }}>🧾</div>
                    <div style={{ marginTop: "8px" }}>No bills found</div>
                  </td></tr>
                ) : filtered.map((bill) => {
                  const { date, time } = fmt(bill.date);
                  return (
                    <tr key={bill.id}
                      style={{ borderBottom: `1px solid ${C.border}`, background: selected?.id === bill.id ? `${C.purple}10` : "transparent", cursor: "pointer", transition: "background 0.12s" }}
                      onClick={() => setSelected(selected?.id === bill.id ? null : bill)}
                      onMouseEnter={(e) => { if (selected?.id !== bill.id) e.currentTarget.style.background = `${C.purple}08`; }}
                      onMouseLeave={(e) => { if (selected?.id !== bill.id) e.currentTarget.style.background = "transparent"; }}>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ color: C.purple, fontWeight: 700, fontFamily: "monospace" }}>#{bill.id}</span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontSize: "13px" }}>{date}</div>
                        <div style={{ color: C.dim, fontSize: "11px" }}>{time}</div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {bill.customer
                          ? <div><div style={{ fontWeight: 500 }}>{bill.customer.name}</div><div style={{ color: C.dim, fontSize: "11px" }}>{bill.customer.mobile}</div></div>
                          : <span style={{ color: C.dim, fontSize: "12px" }}>Walk-in</span>}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <Badge color={C.purple}>{bill.items?.length || 0} items</Badge>
                      </td>
                      <td style={{ padding: "12px 16px", color: C.money, fontWeight: 700, fontSize: "15px" }}>
                        ₹{bill.totalAmount?.toFixed(2)}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <Btn size="sm" color="amber" onClick={(e) => { e.stopPropagation(); reprint(bill); }}>
                          <Icon.Print /> Reprint
                        </Btn>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bill Detail Panel */}
          {selected && (
            <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 style={{ margin: 0, color: C.purple }}>Bill #{selected.id}</h4>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", display: "flex" }}><Icon.X /></button>
              </div>
              <div style={{ fontSize: "12px", color: C.dim }}>{fmt(selected.date).date} at {fmt(selected.date).time}</div>

              {selected.customer && (
                <div style={{ background: `${C.green}10`, border: `1px solid ${C.green}25`, borderRadius: "8px", padding: "10px" }}>
                  <div style={{ color: C.green, fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>CUSTOMER</div>
                  <div style={{ fontWeight: 500 }}>{selected.customer.name}</div>
                  <div style={{ color: C.dim, fontSize: "12px" }}>{selected.customer.mobile}</div>
                </div>
              )}

              <div style={{ borderRadius: "8px", overflow: "hidden", border: `1px solid ${C.border}` }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ background: `${C.purple}12` }}>
                      {["Item", "Qty", "Rate", "Total"].map((h) => (
                        <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: C.muted, fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(selected.items || []).map((item, i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                        <td style={{ padding: "8px 10px" }}>{item.product?.name || "Item"}</td>
                        <td style={{ padding: "8px 10px", color: C.muted }}>{item.qty}</td>
                        <td style={{ padding: "8px 10px", color: C.muted }}>₹{item.price?.toFixed(2)}</td>
                        <td style={{ padding: "8px 10px", color: C.money, fontWeight: 600 }}>₹{item.total?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "#0a0a16", borderRadius: "8px", padding: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: C.money, fontWeight: 700, fontSize: "16px" }}>
                  <span>Grand Total</span>
                  <span>₹{selected.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

              <Btn fullWidth color="amber" onClick={() => reprint(selected)}>
                <Icon.Print /> Reprint Receipt
              </Btn>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
