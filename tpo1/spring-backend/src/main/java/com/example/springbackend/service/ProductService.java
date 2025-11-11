package com.example.springbackend.service;

import com.example.springbackend.model.Product;
import com.example.springbackend.model.Usuario;
import com.example.springbackend.repository.ProductRepository;
import com.example.springbackend.repository.UsuarioRepository;
import com.example.springbackend.exception.ResourceNotFoundException;
import com.example.springbackend.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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
    private final UsuarioRepository usuarioRepository;

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
     * Get the currently authenticated user
     * @return the authenticated user
     * @throws ResourceNotFoundException if no user is authenticated
     */
    private Usuario getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String email = userDetails.getUsername();
            return usuarioRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        } else {
            throw new ResourceNotFoundException("Authentication required to perform this operation");
        }
    }

    /**
     * Check if the authenticated user is an admin
     * @return true if the user is an admin
     */
    private boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getAuthorities() != null) {
            return authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .anyMatch(authority -> authority.equals("ROLE_ADMIN"));
        }
        return false;
    }

    /**
     * Check if the authenticated user is the owner of the product or an admin
     * @param product the product to check
     * @return true if the user is the owner or an admin
     */
    private boolean isOwnerOrAdmin(Product product) {
        if (isAdmin()) {
            return true;
        }
        Usuario usuario = getAuthenticatedUser();
        return product.getUserId() != null && product.getUserId().equals(usuario.getId());
    }

    /**
     * Create a new product
     * The userId is automatically set from the authenticated user.
     */
    public Product create(Product product) {
        if (product.getCreatedAt() == null) {
            product.setCreatedAt(Instant.now());
        }
        
        // Set userId from authenticated user
        Usuario usuario = getAuthenticatedUser();
        product.setUserId(usuario.getId());
        
        return productRepository.save(product);
    }

    /**
     * Update an existing product
     * Only the owner of the product or an admin can update it.
     * The userId cannot be changed (security: prevent manipulation).
     * @param id the id of the product to update
     * @param productDetails the product details to update
     * @return the updated product
     * @throws ResourceNotFoundException if the product does not exist
     * @throws UnauthorizedException if the user is not the owner or an admin
     */
    public Product update(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        
        // Validate permissions: only owner or admin can update
        if (!isOwnerOrAdmin(product)) {
            throw new UnauthorizedException("You are not authorized to update this product");
        }
        
        // Update fields (but not userId - security: prevent manipulation)
        product.setName(productDetails.getName());
        product.setPrice(productDetails.getPrice());
        product.setCategory(productDetails.getCategory());
        product.setDescription(productDetails.getDescription());
        product.setImage(productDetails.getImage());
        product.setStock(productDetails.getStock());
        // userId is not updated - it remains the original owner
        
        return productRepository.save(product);
    }

    /**
     * Delete a product
     * Only the owner of the product or an admin can delete it.
     * @param id the id of the product to delete
     * @throws ResourceNotFoundException if the product does not exist
     * @throws UnauthorizedException if the user is not the owner or an admin
     */
    public void delete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        
        // Validate permissions: only owner or admin can delete
        // Note: Spring Security already protects DELETE endpoints for ADMIN role,
        // but we add an extra layer of security at the service level
        if (!isOwnerOrAdmin(product)) {
            throw new UnauthorizedException("You are not authorized to delete this product");
        }
        
        productRepository.delete(product);
    }

    /**
     * Check if product exists
     */
    public boolean exists(Long id) {
        return productRepository.existsById(id);
    }
}
