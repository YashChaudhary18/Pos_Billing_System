// ─── printReceipt.js ──────────────────────────────────────────────
// Opens a new window with 80mm thermal receipt and triggers print
// ─────────────────────────────────────────────────────────────────

export function printReceipt(bill, customer, items) {
  const date = new Date(bill.date || Date.now());

  const rows = items.map((item) => {
    const base  = item.price * item.qty;
    const gstAmt = (base * (item.gst || 0)) / 100;
    const total  = base + gstAmt;
    return `
      <tr>
        <td>${item.product?.name || item.name || "Item"}</td>
        <td style="text-align:center">${item.qty}</td>
        <td style="text-align:right">&#8377;${item.price.toFixed(2)}</td>
        <td style="text-align:right">&#8377;${total.toFixed(2)}</td>
      </tr>
      ${item.gst > 0 ? `<tr><td colspan="4" style="color:#999;font-size:8px;padding-left:4px">  GST @${item.gst}% = &#8377;${gstAmt.toFixed(2)}</td></tr>` : ""}
    `;
  }).join("");

  const subtotal  = items.reduce((s, i) => s + i.price * i.qty, 0);
  const totalGst  = items.reduce((s, i) => s + (i.price * i.qty * (i.gst || 0)) / 100, 0);
  const grandTotal = bill.totalAmount ?? (subtotal + totalGst);
  const totalQty  = items.reduce((s, i) => s + i.qty, 0);

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>Receipt - Bill #${bill.id}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family: 'Courier Prime', Courier, monospace;
    width: 80mm;
    margin: 0 auto;
    padding: 5mm 4mm;
    font-size: 10px;
    color: #111;
    background: #fff;
  }
  .center   { text-align: center; }
  .bold     { font-weight: 700; }
  .shop     { font-size: 15px; font-weight: 700; letter-spacing: 2px; }
  .sub      { font-size: 9px; color: #444; }
  .dash     { border: none; border-top: 1px dashed #555; margin: 5px 0; }
  .solid    { border: none; border-top: 2px solid #111; margin: 5px 0; }
  table     { width: 100%; border-collapse: collapse; }
  th        { font-size: 9px; border-bottom: 1px solid #bbb; padding: 3px 0; text-align: left; }
  td        { padding: 2px 0; font-size: 9px; }
  .sum-row  { display:flex; justify-content:space-between; padding: 2px 0; }
  .grand    { font-size: 14px; font-weight: 700; border-top: 2px solid #111; padding-top: 5px; margin-top: 3px; display:flex; justify-content:space-between; }
  .footer   { text-align:center; margin-top:8px; font-size:9px; color:#555; }
  @media print {
    body { width: 80mm; }
    @page { margin: 0; size: 80mm auto; }
  }
</style>
</head>
<body>

<!-- Shop Header -->
<div class="center">
  <div class="shop">&#128722;  STORES</div>
</div>

<hr class="solid"/>

<!-- Bill Info -->
<div style="display:flex;justify-content:space-between;margin-bottom:2px;">
  <span><b>Bill #:</b> ${bill.id}</span>
  <span><b>Date:</b> ${date.toLocaleDateString("en-IN")}</span>
</div>
<div><b>Time:</b> ${date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
${customer
  ? `<div><b>Customer:</b> ${customer.name}</div>
     <div><b>Mobile:</b> ${customer.mobile}</div>
     ${customer.address ? `<div class="sub">&#128205; ${customer.address}</div>` : ""}`
  : `<div class="sub">Walk-in Customer</div>`}

<hr class="dash"/>

<!-- Items Table -->
<table>
  <thead>
    <tr>
      <th style="width:40%">Item</th>
      <th style="text-align:center;width:10%">Qty</th>
      <th style="text-align:right;width:22%">Rate</th>
      <th style="text-align:right;width:28%">Amount</th>
    </tr>
  </thead>
  <tbody>
    ${rows}
  </tbody>
</table>

<hr class="dash"/>

<!-- Summary -->
<div class="sum-row"><span>Subtotal (${totalQty} items)</span><span>&#8377;${subtotal.toFixed(2)}</span></div>
<div class="sum-row"><span>Total GST</span><span>&#8377;${totalGst.toFixed(2)}</span></div>

<div class="grand">
  <span>GRAND TOTAL</span>
  <span>&#8377;${grandTotal.toFixed(2)}</span>
</div>

<hr class="dash"/>
<div class="sum-row"><span>Payment Mode</span><span>Cash</span></div>
<div class="sum-row"><span>Cash Received</span><span>&#8377;${grandTotal.toFixed(2)}</span></div>
<div class="sum-row bold"><span>Balance</span><span>&#8377;0.00</span></div>

<!-- Footer -->
<hr class="dash"/>
<div class="footer">
  <div>*** Thank You! Visit Again ***</div>

  <div style="margin-top:6px;font-size:8px;color:#aaa;">** Computer Generated Receipt **</div>
  <div style="font-size:8px;color:#aaa;">Powered by POS Billing System v1.0</div>
</div>

<script>window.onload = function(){ window.print(); }</script>
</body>
</html>`;

  const win = window.open("", "_blank", "width=420,height=650,scrollbars=yes");
  win.document.write(html);
  win.document.close();
}
