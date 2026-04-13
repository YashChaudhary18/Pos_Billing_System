import { useState, useEffect, useCallback } from "react";
import { productApi, customerApi, billApi } from "./api";
import { printReceipt } from "./printReceipt";
import { C, Icon, Btn, Toast, Spinner } from "./components";

export default function POSModule() {
  const [products,         setProducts]         = useState([]);
  const [customers,        setCustomers]         = useState([]);
  const [loading,          setLoading]           = useState(true);
  const [selectedCustomer, setSelectedCustomer]  = useState(null);
  const [cart,             setCart]              = useState([]);
  const [productSearch,    setProductSearch]     = useState("");
  const [customerSearch,   setCustomerSearch]    = useState("");
  const [showProductDD,    setShowProductDD]     = useState(false);
  const [showCustomerDD,   setShowCustomerDD]    = useState(false);
  const [savedBill,        setSavedBill]         = useState(null);
  const [discount,         setDiscount]          = useState(0);
  const [saving,           setSaving]            = useState(false);
  const [toast,            setToast]             = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [prods, custs] = await Promise.all([productApi.getAll(), customerApi.getAll()]);
      setProducts(prods);
      setCustomers(custs);
    } catch (e) {
      showToast("Failed to load data: " + e.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Cart operations ───────────────────────────────────────────
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.productId === product.id);
      if (exists) return prev.map((i) => i.productId === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, {
        productId: product.id, name: product.name,
        price: product.price, gst: product.gst, qty: 1,
      }];
    });
    setProductSearch(""); setShowProductDD(false);
  };

  const updateQty = (productId, qty) => {
    if (qty < 1) { removeFromCart(productId); return; }
    setCart((prev) => prev.map((i) => i.productId === productId ? { ...i, qty } : i));
  };

  const removeFromCart = (productId) => setCart((prev) => prev.filter((i) => i.productId !== productId));

  // ── Calculations ──────────────────────────────────────────────
  const getItemTotal = (item) => {
    const base   = item.price * item.qty;
    const gstAmt = (base * (item.gst || 0)) / 100;
    return base + gstAmt;
  };

  const subtotal   = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalGst   = cart.reduce((s, i) => s + (i.price * i.qty * (i.gst || 0)) / 100, 0);
  const grandTotal = Math.max(0, subtotal + totalGst - discount);
  const totalQty   = cart.reduce((s, i) => s + i.qty, 0);

  // ── Save Bill ─────────────────────────────────────────────────
  const saveBill = async () => {
    if (cart.length === 0) { showToast("Cart is empty!", "error"); return; }
    setSaving(true);
    try {
      const payload = {
        customerId:   selectedCustomer?.id ?? null,
        totalAmount:  grandTotal,
        items: cart.map((i) => ({
          productId: i.productId,
          qty:       i.qty,
          price:     i.price,
          gst:       i.gst,
          total:     getItemTotal(i),
        })),
      };
      const saved = await billApi.create(payload);
      setSavedBill({ ...saved, customer: selectedCustomer, items: payload.items });
      showToast(`Bill #${saved.id} saved successfully!`);
    } catch (e) {
      showToast("Failed to save bill: " + e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const printBill = () => {
    if (!savedBill) return;
    const items = savedBill.items.map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId) || { name: item.name || "Item" },
    }));
    printReceipt(savedBill, savedBill.customer, items);
  };

  const newBill = () => {
    setCart([]); setSelectedCustomer(null); setCustomerSearch("");
    setProductSearch(""); setSavedBill(null); setDiscount(0);
  };

  // ── Dropdown filters ──────────────────────────────────────────
  const filteredProducts  = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.barcode || "").includes(productSearch)
  ).slice(0, 8);

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.mobile.includes(customerSearch)
  ).slice(0, 6);

  // ── GST breakdown ─────────────────────────────────────────────
  const gstBreakdown = [...new Set(cart.filter((i) => i.gst > 0).map((i) => i.gst))].map((rate) => {
    const taxable = cart.filter((i) => i.gst === rate).reduce((s, i) => s + i.price * i.qty, 0);
    return { rate, taxable, tax: (taxable * rate) / 100 };
  });

  if (loading) return <Spinner />;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "20px", minHeight: "calc(100vh - 160px)" }}>
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}

      {/* ── LEFT PANEL ───────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Customer Selector */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "14px", padding: "16px" }}>
          <label style={{ color: C.muted, fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>
            👤 CUSTOMER (Optional — walk-in allowed)
          </label>
          <div style={{ position: "relative" }}>
            <input
              value={selectedCustomer ? `${selectedCustomer.name} — ${selectedCustomer.mobile}` : customerSearch}
              onChange={(e) => { setCustomerSearch(e.target.value); setSelectedCustomer(null); setShowCustomerDD(true); }}
              onFocus={() => setShowCustomerDD(true)}
              onBlur={() => setTimeout(() => setShowCustomerDD(false), 200)}
              placeholder="Search customer by name or mobile..."
              style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border2}`, borderRadius: "10px", padding: "10px 40px 10px 14px", color: C.text, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            />
            {selectedCustomer && (
              <button onClick={() => { setSelectedCustomer(null); setCustomerSearch(""); }}
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#666", cursor: "pointer", display: "flex" }}>
                <Icon.X />
              </button>
            )}
            {showCustomerDD && filteredCustomers.length > 0 && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#1a1a2e", border: `1px solid ${C.border2}`, borderRadius: "10px", zIndex: 200, marginTop: "4px", overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                {filteredCustomers.map((c) => (
                  <div key={c.id} onMouseDown={() => { setSelectedCustomer(c); setShowCustomerDD(false); }}
                    style={{ padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${C.border}` }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = `${C.green}15`)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <div style={{ fontWeight: 500 }}>{c.name}</div>
                    <div style={{ color: C.dim, fontSize: "12px" }}>{c.mobile} · {c.address}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Search */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "14px", padding: "16px" }}>
          <label style={{ color: C.muted, fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>
            📦 ADD PRODUCT / SCAN BARCODE
          </label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#555" }}><Icon.Search /></span>
            <input
              value={productSearch}
              onChange={(e) => { setProductSearch(e.target.value); setShowProductDD(true); }}
              onFocus={() => productSearch && setShowProductDD(true)}
              onBlur={() => setTimeout(() => setShowProductDD(false), 200)}
              placeholder="Search product name or scan barcode..."
              autoFocus
              style={{ width: "100%", paddingLeft: "38px", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border2}`, borderRadius: "10px", padding: "10px 14px 10px 38px", color: C.text, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            />
            {showProductDD && productSearch && filteredProducts.length > 0 && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#1a1a2e", border: `1px solid ${C.border2}`, borderRadius: "10px", zIndex: 200, marginTop: "4px", maxHeight: "260px", overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                {filteredProducts.map((p) => (
                  <div key={p.id} onMouseDown={() => addToCart(p)}
                    style={{ padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = `${C.purple}15`)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{p.name}</div>
                      <div style={{ color: C.dim, fontSize: "11px" }}>GST: {p.gst}% {p.barcode ? `· 🔲 ${p.barcode}` : ""}</div>
                    </div>
                    <span style={{ color: C.money, fontWeight: 700 }}>₹{p.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
            {showProductDD && productSearch && filteredProducts.length === 0 && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#1a1a2e", border: `1px solid ${C.border2}`, borderRadius: "10px", zIndex: 200, marginTop: "4px", padding: "16px", textAlign: "center", color: C.dim }}>
                No product found for "{productSearch}"
              </div>
            )}
          </div>
        </div>

        {/* Cart */}
        <div style={{ flex: 1, background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "10px" }}>
            <Icon.Cart />
            <span style={{ fontWeight: 700 }}>Cart</span>
            {cart.length > 0 && (
              <span style={{ background: `${C.purple}22`, color: C.purple, borderRadius: "20px", padding: "2px 10px", fontSize: "12px", fontWeight: 600 }}>
                {totalQty} items
              </span>
            )}
            {cart.length > 0 && (
              <button onClick={() => setCart([])} style={{ marginLeft: "auto", background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: "12px" }}>
                Clear All
              </button>
            )}
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: C.dim }}>
                <div style={{ fontSize: "44px", marginBottom: "10px" }}>🛒</div>
                <div style={{ fontSize: "14px" }}>Cart is empty</div>
                <div style={{ fontSize: "12px", marginTop: "4px" }}>Search and add products above</div>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: `1px solid ${C.border}` }}>
                    {["Product", "Rate", "GST", "Qty", "Total", ""].map((h) => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "#555", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.productId} style={{ borderBottom: `1px solid ${C.border}`, transition: "background 0.12s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = `${C.purple}08`)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      <td style={{ padding: "11px 12px", fontWeight: 500, maxWidth: "180px" }}>{item.name}</td>
                      <td style={{ padding: "11px 12px", color: C.muted, fontSize: "13px" }}>₹{item.price.toFixed(2)}</td>
                      <td style={{ padding: "11px 12px" }}>
                        <span style={{ color: C.amber, fontSize: "12px", background: `${C.amber}15`, padding: "2px 6px", borderRadius: "4px" }}>{item.gst}%</span>
                      </td>
                      <td style={{ padding: "11px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <button onClick={() => updateQty(item.productId, item.qty - 1)}
                            style={{ width: "28px", height: "28px", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border2}`, borderRadius: "6px", color: C.text, cursor: "pointer", fontSize: "15px", lineHeight: 1 }}>−</button>
                          <input type="number" min="1" value={item.qty}
                            onChange={(e) => updateQty(item.productId, parseInt(e.target.value) || 1)}
                            style={{ width: "40px", textAlign: "center", background: "rgba(255,255,255,0.06)", border: `1px solid ${C.border2}`, borderRadius: "6px", color: C.text, padding: "4px", fontSize: "13px", outline: "none" }} />
                          <button onClick={() => updateQty(item.productId, item.qty + 1)}
                            style={{ width: "28px", height: "28px", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border2}`, borderRadius: "6px", color: C.text, cursor: "pointer", fontSize: "15px", lineHeight: 1 }}>+</button>
                        </div>
                      </td>
                      <td style={{ padding: "11px 12px", color: C.money, fontWeight: 700, fontSize: "13px" }}>
                        ₹{getItemTotal(item).toFixed(2)}
                      </td>
                      <td style={{ padding: "11px 12px" }}>
                        <button onClick={() => removeFromCart(item.productId)}
                          style={{ background: `${C.red}15`, border: "none", color: C.red, cursor: "pointer", borderRadius: "6px", padding: "5px 7px", display: "flex", alignItems: "center" }}>
                          <Icon.X />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Bill Summary ────────────────────────── */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", position: "sticky", top: "16px", alignSelf: "start" }}>
        <h3 style={{ fontWeight: 700, fontSize: "16px", margin: 0 }}>🧾 Bill Summary</h3>

        {/* Customer Info */}
        {selectedCustomer ? (
          <div style={{ background: `${C.green}10`, border: `1px solid ${C.green}30`, borderRadius: "10px", padding: "12px" }}>
            <div style={{ color: C.green, fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>CUSTOMER</div>
            <div style={{ fontWeight: 600 }}>{selectedCustomer.name}</div>
            <div style={{ color: C.dim, fontSize: "12px" }}>📞 {selectedCustomer.mobile}</div>
            {selectedCustomer.address && <div style={{ color: C.dim, fontSize: "11px" }}>📍 {selectedCustomer.address}</div>}
          </div>
        ) : (
          <div style={{ background: "rgba(255,255,255,0.03)", border: `1px dashed ${C.border2}`, borderRadius: "10px", padding: "10px", textAlign: "center", color: C.dim, fontSize: "12px" }}>
            Walk-in Customer
          </div>
        )}

        {/* Amount Breakdown */}
        <div style={{ background: "#0a0a16", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: C.muted, fontSize: "14px" }}>
            <span>Subtotal ({totalQty} items)</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: C.amber, fontSize: "14px" }}>
            <span>Total GST</span>
            <span>₹{totalGst.toFixed(2)}</span>
          </div>
          {/* Discount */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#ff8888", fontSize: "14px" }}>
            <span>Discount (₹)</span>
            <input type="number" min="0" value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              style={{ width: "90px", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border2}`, borderRadius: "6px", padding: "4px 8px", color: "#ff8888", textAlign: "right", fontSize: "14px", outline: "none" }} />
          </div>
          <div style={{ borderTop: `1px dashed ${C.border2}`, paddingTop: "10px", display: "flex", justifyContent: "space-between", color: C.money, fontSize: "20px", fontWeight: 800 }}>
            <span>TOTAL</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* GST Breakdown */}
        {gstBreakdown.length > 0 && (
          <div style={{ background: `${C.amber}08`, border: `1px solid ${C.amber}20`, borderRadius: "10px", padding: "12px" }}>
            <div style={{ color: C.amber, fontSize: "11px", fontWeight: 700, marginBottom: "8px" }}>GST SLAB BREAKDOWN</div>
            {gstBreakdown.map(({ rate, taxable, tax }) => (
              <div key={rate} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: C.muted, marginBottom: "4px" }}>
                <span>@{rate}% on ₹{taxable.toFixed(2)}</span>
                <span style={{ color: C.amber }}>₹{tax.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
          {!savedBill ? (
            <Btn fullWidth onClick={saveBill} disabled={saving || cart.length === 0} style={{ padding: "14px", fontSize: "15px" }}>
              {saving ? "💾 Saving..." : "💾 Save Bill"}
            </Btn>
          ) : (
            <>
              <div style={{ background: `${C.green}12`, border: `1px solid ${C.green}40`, borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                <div style={{ color: C.green, fontWeight: 700 }}>✅ Bill #{savedBill.id} Saved!</div>
                <div style={{ color: C.dim, fontSize: "12px", marginTop: "2px" }}>{new Date(savedBill.date).toLocaleString("en-IN")}</div>
              </div>
              <Btn fullWidth color="amber" onClick={printBill} style={{ padding: "13px" }}>
                <Icon.Print /> Print Receipt (80mm)
              </Btn>
              <Btn fullWidth color="ghost" onClick={newBill}>
                🆕 New Bill
              </Btn>
            </>
          )}
        </div>

        {/* Stats Footer */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "12px", display: "flex", justifyContent: "space-around", fontSize: "12px", color: C.dim }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: C.purple, fontWeight: 700, fontSize: "16px" }}>{cart.length}</div>
            <div>Products</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: C.purple, fontWeight: 700, fontSize: "16px" }}>{totalQty}</div>
            <div>Items</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: C.money, fontWeight: 700, fontSize: "16px" }}>₹{grandTotal.toFixed(0)}</div>
            <div>Total</div>
          </div>
        </div>
      </div>
    </div>
  );
}
