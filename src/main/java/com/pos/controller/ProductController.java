package com.pos.controller;

import com.pos.dto.ApiResponse;
import com.pos.entity.Product;
import com.pos.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getAllProducts()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getById(id)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Product>>> searchProducts(@RequestParam String q) {
        return ResponseEntity.ok(ApiResponse.ok(productService.search(q)));
    }

    @GetMapping("/barcode/{barcode}")
    public ResponseEntity<ApiResponse<Product>> getByBarcode(@PathVariable String barcode) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getByBarcode(barcode)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(ApiResponse.ok("Product created", productService.create(product)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(@PathVariable Long id,
                                                              @RequestBody Product product) {
        return ResponseEntity.ok(ApiResponse.ok("Product updated", productService.update(id, product)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok(ApiResponse.<Void>ok("Product deleted", null));
    }
}
