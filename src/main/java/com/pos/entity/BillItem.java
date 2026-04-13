package com.pos.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "bill_items")
public class BillItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id", nullable = false)
    @JsonIgnore
    private Bill bill;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer qty;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Double gst;

    @Column(nullable = false)
    private Double total;

    public BillItem() {}

    // Getters
    public Long    getId()      { return id; }
    public Bill    getBill()    { return bill; }
    public Product getProduct() { return product; }
    public Integer getQty()     { return qty; }
    public Double  getPrice()   { return price; }
    public Double  getGst()     { return gst; }
    public Double  getTotal()   { return total; }

    // Setters
    public void setId(Long id)           { this.id      = id; }
    public void setBill(Bill bill)       { this.bill    = bill; }
    public void setProduct(Product p)    { this.product = p; }
    public void setQty(Integer qty)      { this.qty     = qty; }
    public void setPrice(Double price)   { this.price   = price; }
    public void setGst(Double gst)       { this.gst     = gst; }
    public void setTotal(Double total)   { this.total   = total; }
}
