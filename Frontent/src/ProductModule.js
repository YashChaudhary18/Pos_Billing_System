import { useState, useEffect, useCallback } from "react";
import { productApi } from "./api";
import { C, Icon, Modal, Field, Btn, Badge, SearchBar, Table, Toast, Spinner } from "./components";

const EMPTY_FORM = { name: "", price: "", gst: "0", barcode: "" };

export default function ProductModule() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [showModal,setShowModal]= useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [errors,   setErrors]   = useState({});
  const [toast,    setToast]    = useState(null);
  const [saving,   setSaving]   = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productApi.getAll();
      setProducts(data);
    } catch (e) {
      showToast("Failed to load products: " + e.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setForm(EMPTY_FORM); setEditing(null); setErrors({}); setShowModal(true);
  };
  const openEdit = (p) => {
    setForm({ name: p.name, price: String(p.price), gst: String(p.gst), barcode: p.barcode || "" });
    setEditing(p); setErrors({}); setShowModal(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())       e.name  = "Name is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
                                  e.price = "Valid price required";
    if (isNaN(Number(form.gst))) e.gst   = "Valid GST required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        name:    form.name.trim(),
        price:   parseFloat(form.price),
        gst:     parseFloat(form.gst) || 0,
        barcode: form.barcode.trim() || null,
      };
      if (editing) {
        await productApi.update(editing.id, payload);
        showToast("Product updated successfully!");
      } else {
        await productApi.create(payload);
        showToast("Product added successfully!");
      }
      setShowModal(false);
      load();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      await productApi.delete(p.id);
      showToast(`"${p.name}" deleted`);
      load();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.barcode || "").includes(search)
  );

  const GST_RATES = ["0", "5", "12", "18", "28"];

  const columns = [
    { key: "idx",     label: "#",            render: (_, i) => <span style={{ color: C.dim }}>{i + 1}</span> },
    { key: "name",    label: "Product Name", render: (p) => <span style={{ fontWeight: 500 }}>{p.name}</span> },
    { key: "price",   label: "Price (₹)",    render: (p) => <span style={{ color: C.money }}>₹{p.price.toFixed(2)}</span> },
    { key: "gst",     label: "GST (%)",      render: (p) => <Badge color={p.gst > 0 ? C.amber : C.dim}>{p.gst}%</Badge> },
    { key: "barcode", label: "Barcode",      render: (p) => <span style={{ color: C.dim, fontFamily: "monospace", fontSize: "12px" }}>{p.barcode || "—"}</span> },
    {
      key: "actions", label: "Actions",
      render: (p) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Btn size="sm" color="purple" outline onClick={() => openEdit(p)}><Icon.Edit /> Edit</Btn>
          <Btn size="sm" color="red"    outline onClick={() => remove(p)}><Icon.Trash /> Del</Btn>
        </div>
      ),
    },
  ];

  // patch Table to pass index
  const rows = filtered.map((p, i) => ({ ...p, idx: i + 1 }));

  return (
    <div>
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}

      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or barcode..." width="300px" />
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Badge color={C.purple}>{filtered.length} products</Badge>
          <Btn onClick={openAdd}><Icon.Add /> Add Product</Btn>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <Table
          columns={columns}
          rows={rows}
          accent={C.purple}
          emptyText="No products found. Add your first product!"
        />
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <Modal title={editing ? `Edit: ${editing.name}` : "Add New Product"} onClose={() => setShowModal(false)}>
          <Field label="Product Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })}
            placeholder="e.g. Basmati Rice 5kg" required error={errors.name} />
          <Field label="Price (₹)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })}
            placeholder="0.00" required error={errors.price} />

          {/* GST Rate Buttons */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", color: C.muted, fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>
              GST Rate (%) <span style={{ color: "#ff7755" }}>*</span>
            </label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {GST_RATES.map((rate) => (
                <button key={rate} onClick={() => setForm({ ...form, gst: rate })}
                  style={{
                    padding: "7px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600,
                    border: form.gst === rate ? `2px solid ${C.amber}` : `1px solid ${C.border2}`,
                    background: form.gst === rate ? `${C.amber}20` : "rgba(255,255,255,0.03)",
                    color: form.gst === rate ? C.amber : C.dim,
                    transition: "all 0.15s",
                  }}>
                  {rate}%
                </button>
              ))}
            </div>
          </div>

          <Field label="Barcode (Optional)" value={form.barcode} onChange={(v) => setForm({ ...form, barcode: v })}
            placeholder="e.g. 8901234567890" />

          {/* Preview */}
          {form.price && (
            <div style={{ background: "rgba(160,240,160,0.06)", border: `1px solid ${C.money}22`, borderRadius: "10px", padding: "12px", marginBottom: "16px" }}>
              <div style={{ color: C.muted, fontSize: "11px", marginBottom: "6px" }}>PRICE PREVIEW</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: C.dim }}>Base Price</span>
                <span>₹{parseFloat(form.price || 0).toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: C.dim }}>GST @{form.gst}%</span>
                <span>₹{(parseFloat(form.price || 0) * parseFloat(form.gst || 0) / 100).toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: C.money, marginTop: "6px", borderTop: `1px dashed ${C.border}`, paddingTop: "6px" }}>
                <span>Customer Pays</span>
                <span>₹{(parseFloat(form.price || 0) * (1 + parseFloat(form.gst || 0) / 100)).toFixed(2)}</span>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <Btn color="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={save} disabled={saving}>
              {saving ? "Saving..." : editing ? "Update Product" : "Save Product"}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
