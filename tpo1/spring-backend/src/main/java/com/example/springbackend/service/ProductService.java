package com.example.springbackend.service;

import com.example.springbackend.model.Product;
import com.example.springbackend.dto.ProductDTO;
import com.example.springbackend.mapping.ProductMapper;
import com.example.springbackend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;
import com.example.springbackend.model.Usuario;

/**
 * Product Service
 * Business logic layer for Product operations
 */
@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    private final ProductMapper productMapper;

    /**
     * Get all products
     */
    public List<ProductDTO> findAll() {
        List<Product> products = productRepository.findAll();
        return productMapper.toDtoList(products);
    }

    /**
     * Get product by ID
     */
    public ProductDTO findById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        return productMapper.toDto(product);
    }

    /**
     * Find products by category
     */
    public List<ProductDTO> findByCategory(String category) {
        List<Product> products = productRepository.findByCategory(category);
        return productMapper.toDtoList(products);
    }

    /**
     * Create a new product
     */
    public ProductDTO create(ProductDTO productDto) {
        Product product = productMapper.toEntity(productDto);
        Product saved = productRepository.save(product);
        return productMapper.toDto(saved);
    }

    /**
     * Update an existing product
     */
    public ProductDTO update(Long id, ProductDTO productDto) {
        Product product = productMapper.toEntity(productDto);
        Product savedProduct = productRepository.findById(id)
                .map(existingProduct -> {
                    existingProduct.setName(product.getName());
                    existingProduct.setPrice(product.getPrice());
                    existingProduct.setCategory(product.getCategory());
                    existingProduct.setDescription(product.getDescription());
                    existingProduct.setImage(product.getImage());
                    existingProduct.setStock(product.getStock());
                    return productRepository.save(existingProduct);
                }).orElse(null);

        return savedProduct != null ? productMapper.toDto(savedProduct) : null;
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
     * Delete product if the requesting user is the owner or has ADMIN role
     * @return true if deleted, false if not authorized or not found
     */
    public boolean deleteIfOwnerOrAdmin(Long id, Usuario usuario) {
        Optional<Product> opt = productRepository.findById(id);
        if (opt.isEmpty()) return false;
        Product product = opt.get();

        // Allow if admin
        boolean isAdmin = usuario.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) {
            productRepository.deleteById(id);
            return true;
        }

        // Allow if owner
        Long ownerId = product.getUserId();
        if (ownerId != null && usuario.getId() != null && ownerId.equals(usuario.getId())) {
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

    /**
     * Find products by user id
     */
    /**
     * Find products by user id and return as DTOs
     * (Service API returns DTOs)
     */
    public java.util.List<com.example.springbackend.dto.ProductDTO> findByUserId(Long userId) {
        java.util.List<Product> products = productRepository.findByUserId(userId);
        return productMapper.toDtoList(products);
    }
}
