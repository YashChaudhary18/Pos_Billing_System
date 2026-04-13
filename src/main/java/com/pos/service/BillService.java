package com.pos.service;

import com.pos.dto.BillRequest;
import com.pos.entity.*;
import com.pos.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class BillService {

    private final BillRepository     billRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository  productRepository;

    public BillService(BillRepository billRepository,
                       CustomerRepository customerRepository,
                       ProductRepository productRepository) {
        this.billRepository     = billRepository;
        this.customerRepository = customerRepository;
        this.productRepository  = productRepository;
    }

    @Transactional
    public Bill createBill(BillRequest request) {
        System.out.println("Creating bill. Items count: " + request.getItems().size());

        // Optional customer
        Customer customer = null;
        if (request.getCustomerId() != null) {
            customer = customerRepository.findById(request.getCustomerId()).orElse(null);
        }

        // Build bill
        Bill bill = new Bill();
        bill.setCustomer(customer);
        bill.setTotalAmount(request.getTotalAmount());

        // Build items
        List<BillItem> items = new ArrayList<>();
        for (BillRequest.BillItemRequest req : request.getItems()) {
            Product product = productRepository.findById(req.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + req.getProductId()));

            BillItem item = new BillItem();
            item.setBill(bill);
            item.setProduct(product);
            item.setQty(req.getQty());
            item.setPrice(req.getPrice());
            item.setGst(req.getGst());
            item.setTotal(req.getTotal());
            items.add(item);
        }

        bill.setItems(items);
        Bill saved = billRepository.save(bill);
        System.out.println("Bill saved with ID: " + saved.getId());
        return saved;
    }

    public Bill getById(Long id) {
        return billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found: " + id));
    }

    public List<Bill> getAllBills() {
        return billRepository.findAllByOrderByDateDesc();
    }

    public List<Bill> getBillsByCustomer(Long customerId) {
        return billRepository.findByCustomerId(customerId);
    }
}
