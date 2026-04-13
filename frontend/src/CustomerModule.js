import { useState, useEffect, useCallback } from "react";
import { customerApi } from "./api";
import { C, Icon, Modal, Field, Btn, Badge, SearchBar, Table, Toast, Spinner } from "./components";

const EMPTY_FORM = { name: "", mobile: "", address: "" };

export default function CustomerModule() {
  const [customers, setCustomers] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [errors,    setErrors]    = useState({});
  const [toast,     setToast]     = useState(null);
  const [saving,    setSaving]    = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await customerApi.getAll();
      setCustomers(data);
    } catch (e) {
      showToast("Failed to load customers: " + e.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setForm(EMPTY_FORM); setEditing(null); setErrors({}); setShowModal(true); };
  const openEdit = (c) => {
    setForm({ name: c.name, mobile: c.mobile, address: c.address || "" });
    setEditing(c); setErrors({}); setShowModal(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())                          e.name   = "Name is required";
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim()))  e.mobile = "Enter valid 10-digit mobile";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { name: form.name.trim(), mobile: form.mobile.trim(), address: form.address.trim() };
      if (editing) {
        await customerApi.update(editing.id, payload);
        showToast("Customer updated!");
      } else {
        await customerApi.create(payload);
        showToast("Customer added!");
      }
      setShowModal(false);
      load();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete customer "${c.name}"?`)) return;
    try {
      await customerApi.delete(c.id);
      showToast(`"${c.name}" deleted`);
      load();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile.includes(search)
  );

  const Avatar = ({ name }) => (
    <div style={{
      width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0,
      background: `linear-gradient(135deg,${C.green},${C.greenD})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "14px", fontWeight: 700, color: "#fff",
    }}>{name.charAt(0).toUpperCase()}</div>
  );

  const columns = [
    { key: "idx",     label: "#",       render: (_, i) => <span style={{ color: C.dim }}>{i + 1}</span> },
    { key: "name",    label: "Customer",render: (c) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar name={c.name} />
          <span style={{ fontWeight: 500 }}>{c.name}</span>
        </div>
      )
    },
    { key: "mobile",  label: "Mobile",  render: (c) => <span style={{ fontFamily: "monospace", color: C.muted }}>📞 {c.mobile}</span> },
    { key: "address", label: "Address", render: (c) => <span style={{ color: C.dim, fontSize: "12px" }}>{c.address || "—"}</span> },
    {
      key: "actions", label: "Actions",
      render: (c) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Btn size="sm" color="green"  outline onClick={() => openEdit(c)}><Icon.Edit /> Edit</Btn>
          <Btn size="sm" color="red"    outline onClick={() => remove(c)}><Icon.Trash /> Del</Btn>
        </div>
      ),
    },
  ];

  const rows = filtered.map((c, i) => ({ ...c, idx: i + 1 }));

  return (
    <div>
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or mobile..." width="300px" />
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Badge color={C.green}>{filtered.length} customers</Badge>
          <Btn color="green" onClick={openAdd}><Icon.Add /> Add Customer</Btn>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <Table columns={columns} rows={rows} accent={C.green} emptyText="No customers found. Add your first customer!" />
      )}

      {showModal && (
        <Modal title={editing ? `Edit: ${editing.name}` : "Add New Customer"} onClose={() => setShowModal(false)}>
          <Field label="Customer Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })}
            placeholder="e.g. Rahul Sharma" required error={errors.name} />
          <Field label="Mobile Number" type="tel" value={form.mobile} onChange={(v) => setForm({ ...form, mobile: v })}
            placeholder="10-digit mobile number" required error={errors.mobile} />
          <Field label="Address (Optional)" value={form.address} onChange={(v) => setForm({ ...form, address: v })}
            placeholder="Full address" />
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "4px" }}>
            <Btn color="ghost" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn color="green" onClick={save} disabled={saving}>
              {saving ? "Saving..." : editing ? "Update Customer" : "Save Customer"}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
