package com.pos.service;

import com.pos.entity.Customer;
import com.pos.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found: " + id));
    }

    public List<Customer> search(String query) {
        return customerRepository.findByNameContainingIgnoreCase(query);
    }

    public Customer getByMobile(String mobile) {
        return customerRepository.findByMobile(mobile)
                .orElseThrow(() -> new RuntimeException("Customer not found with mobile: " + mobile));
    }

    public Customer create(Customer customer) {
        System.out.println("Creating customer: " + customer.getName());
        return customerRepository.save(customer);
    }

    public Customer update(Long id, Customer updated) {
        Customer existing = getById(id);
        existing.setName(updated.getName());
        existing.setMobile(updated.getMobile());
        existing.setAddress(updated.getAddress());
        System.out.println("Updating customer id: " + id);
        return customerRepository.save(existing);
    }

    public void delete(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found: " + id);
        }
        System.out.println("Deleting customer id: " + id);
        customerRepository.deleteById(id);
    }
}
