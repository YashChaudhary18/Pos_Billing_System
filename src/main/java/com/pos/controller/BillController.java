package com.pos.controller;

import com.pos.dto.ApiResponse;
import com.pos.dto.BillRequest;
import com.pos.entity.Bill;
import com.pos.service.BillService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/bills")
@CrossOrigin(origins = "*")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Bill>> createBill(@RequestBody BillRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Bill created", billService.createBill(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Bill>> getBill(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(billService.getById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Bill>>> getAllBills() {
        return ResponseEntity.ok(ApiResponse.ok(billService.getAllBills()));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<Bill>>> getBillsByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(ApiResponse.ok(billService.getBillsByCustomer(customerId)));
    }
}
