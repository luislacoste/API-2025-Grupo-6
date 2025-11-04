package com.example.springbackend.service;

import com.example.springbackend.model.Product;
import com.example.springbackend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Product Service
 * Business logic layer for Product operations
 */
@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    /**
     * Get all products
     */
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    /**
     * Get product by ID
     */
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    /**
     * Find products by category
     */
    public List<Product> findByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    /**
     * Create a new product
     */
    public Product create(Product product) {
        if (product.getCreatedAt() == null) {
            product.setCreatedAt(Instant.now());
        }
        return productRepository.save(product);
    }

    /**
     * Update an existing product
     */
    public Optional<Product> update(Long id, Product productDetails) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setName(productDetails.getName());
                    product.setPrice(productDetails.getPrice());
                    product.setCategory(productDetails.getCategory());
                    product.setDescription(productDetails.getDescription());
                    product.setImage(productDetails.getImage());
                    product.setStock(productDetails.getStock());
                    product.setUserId(productDetails.getUserId());
                    return productRepository.save(product);
                });
    }

    /**
     * Delete a product
     */
    public boolean delete(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Check if product exists
     */
    public boolean exists(Long id) {
        return productRepository.existsById(id);
    }
}
