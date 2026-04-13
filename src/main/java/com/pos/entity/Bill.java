package com.pos.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "bills")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Column(nullable = false)
    private Double totalAmount;

    @Column(nullable = false)
    private LocalDateTime date;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<BillItem> items;

    public Bill() {}

    @PrePersist
    protected void onCreate() {
        this.date = LocalDateTime.now();
    }

    // Getters
    public Long          getId()          { return id; }
    public Customer      getCustomer()    { return customer; }
    public Double        getTotalAmount() { return totalAmount; }
    public LocalDateTime getDate()        { return date; }
    public List<BillItem> getItems()      { return items; }

    // Setters
    public void setId(Long id)                    { this.id          = id; }
    public void setCustomer(Customer customer)     { this.customer    = customer; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public void setDate(LocalDateTime date)        { this.date        = date; }
    public void setItems(List<BillItem> items)     { this.items       = items; }
}
