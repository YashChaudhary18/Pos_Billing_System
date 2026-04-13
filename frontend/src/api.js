// ─── api.js ───────────────────────────────────────────────────────
// All backend API calls go through this file.
// Base URL uses the "proxy" from package.json in dev mode.
// ─────────────────────────────────────────────────────────────────

const BASE = "";   // empty = uses proxy (http://localhost:8080)

const req = async (method, url, body) => {
  const res = await fetch(`${BASE}${url}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "API Error");
  return json.data;
};

// ── Products ──────────────────────────────────────────────────────
export const productApi = {
  getAll:        ()           => req("GET",    "/products"),
  getById:       (id)         => req("GET",    `/products/${id}`),
  search:        (q)          => req("GET",    `/products/search?q=${q}`),
  getByBarcode:  (barcode)    => req("GET",    `/products/barcode/${barcode}`),
  create:        (data)       => req("POST",   "/products", data),
  update:        (id, data)   => req("PUT",    `/products/${id}`, data),
  delete:        (id)         => req("DELETE", `/products/${id}`),
};

// ── Customers ─────────────────────────────────────────────────────
export const customerApi = {
  getAll:        ()           => req("GET",    "/customers"),
  getById:       (id)         => req("GET",    `/customers/${id}`),
  search:        (q)          => req("GET",    `/customers/search?q=${q}`),
  getByMobile:   (mobile)     => req("GET",    `/customers/mobile/${mobile}`),
  create:        (data)       => req("POST",   "/customers", data),
  update:        (id, data)   => req("PUT",    `/customers/${id}`, data),
  delete:        (id)         => req("DELETE", `/customers/${id}`),
};

// ── Bills ─────────────────────────────────────────────────────────
export const billApi = {
  getAll:        ()           => req("GET",    "/bills"),
  getById:       (id)         => req("GET",    `/bills/${id}`),
  getByCustomer: (cid)        => req("GET",    `/bills/customer/${cid}`),
  create:        (data)       => req("POST",   "/bills", data),
};
