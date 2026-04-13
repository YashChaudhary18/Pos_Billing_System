package com.pos.dto;

import java.util.List;

public class BillRequest {

    private Long customerId;
    private Double totalAmount;
    private List<BillItemRequest> items;

    public BillRequest() {}

    // Getters
    public Long   getCustomerId()   { return customerId; }
    public Double getTotalAmount()  { return totalAmount; }
    public List<BillItemRequest> getItems() { return items; }

    // Setters
    public void setCustomerId(Long customerId)     { this.customerId   = customerId; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount  = totalAmount; }
    public void setItems(List<BillItemRequest> items) { this.items     = items; }

    // ── Inner class ────────────────────────────────────────────────
    public static class BillItemRequest {
        private Long   productId;
        private Integer qty;
        private Double price;
        private Double gst;
        private Double total;

        public BillItemRequest() {}

        // Getters
        public Long    getProductId() { return productId; }
        public Integer getQty()       { return qty; }
        public Double  getPrice()     { return price; }
        public Double  getGst()       { return gst; }
        public Double  getTotal()     { return total; }

        // Setters
        public void setProductId(Long productId) { this.productId = productId; }
        public void setQty(Integer qty)          { this.qty       = qty; }
        public void setPrice(Double price)       { this.price     = price; }
        public void setGst(Double gst)           { this.gst       = gst; }
        public void setTotal(Double total)       { this.total     = total; }
    }
}
