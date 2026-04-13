package com.pos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BillingSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(BillingSystemApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("  POS Billing System Started!");
        System.out.println("  API:      http://localhost:8080");
        System.out.println("  H2 DB:    http://localhost:8080/h2-console");
        System.out.println("========================================\n");
    }
}
