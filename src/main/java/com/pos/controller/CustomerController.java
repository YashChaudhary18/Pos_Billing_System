package com.pos.controller;

import com.pos.dto.ApiResponse;
import com.pos.entity.Customer;
import com.pos.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Customer>>> getAllCustomers() {
        return ResponseEntity.ok(ApiResponse.ok(customerService.getAllCustomers()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> getCustomer(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(customerService.getById(id)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Customer>>> searchCustomers(@RequestParam String q) {
        return ResponseEntity.ok(ApiResponse.ok(customerService.search(q)));
    }

    @GetMapping("/mobile/{mobile}")
    public ResponseEntity<ApiResponse<Customer>> getByMobile(@PathVariable String mobile) {
        return ResponseEntity.ok(ApiResponse.ok(customerService.getByMobile(mobile)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Customer>> createCustomer(@RequestBody Customer customer) {
        return ResponseEntity.ok(ApiResponse.ok("Customer created", customerService.create(customer)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> updateCustomer(@PathVariable Long id,
                                                                @RequestBody Customer customer) {
        return ResponseEntity.ok(ApiResponse.ok("Customer updated", customerService.update(id, customer)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable Long id) {
        customerService.delete(id);
        return ResponseEntity.ok(ApiResponse.<Void>ok("Customer deleted", null));
    }
}
