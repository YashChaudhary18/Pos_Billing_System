package com.pos.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Double gst;

    @Column
    private String barcode;

    public Product() {}

    // Getters
    public Long   getId()      { return id; }
    public String getName()    { return name; }
    public Double getPrice()   { return price; }
    public Double getGst()     { return gst; }
    public String getBarcode() { return barcode; }

    // Setters
    public void setId(Long id)         { this.id      = id; }
    public void setName(String name)   { this.name    = name; }
    public void setPrice(Double price) { this.price   = price; }
    public void setGst(Double gst)     { this.gst     = gst; }
    public void setBarcode(String b)   { this.barcode = b; }
}
