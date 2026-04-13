package com.pos.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 10)
    private String mobile;

    @Column
    private String address;

    public Customer() {}

    // Getters
    public Long   getId()      { return id; }
    public String getName()    { return name; }
    public String getMobile()  { return mobile; }
    public String getAddress() { return address; }

    // Setters
    public void setId(Long id)           { this.id      = id; }
    public void setName(String name)     { this.name    = name; }
    public void setMobile(String mobile) { this.mobile  = mobile; }
    public void setAddress(String addr)  { this.address = addr; }
}
