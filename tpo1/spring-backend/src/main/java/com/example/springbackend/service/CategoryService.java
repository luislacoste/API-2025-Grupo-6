package com.example.springbackend.service;

import com.example.springbackend.model.Category;
import com.example.springbackend.repository.CategoryRepository;
import com.example.springbackend.exception.ResourceNotFoundException;
import com.example.springbackend.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Category Service
 * Business logic layer for Category operations
 */
@Service
@Transactional
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    /**
     * Get all categories
     */
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    /**
     * Get category by ID
     */
    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id);
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
     * Create a new category
     * Only administrators can create categories.
     * @throws UnauthorizedException if the user is not an admin
     */
    public Category create(Category category) {
        // Validate permissions: only admin can create categories
        // Defense in depth: even though Spring Security protects the endpoint,
        // we validate here in case the service is called directly
        if (!isAdmin()) {
            throw new UnauthorizedException("Only administrators can create categories");
        }
        
        if (category.getProductCount() == null) {
            category.setProductCount(0);
        }
        return categoryRepository.save(category);
    }

    /**
     * Update an existing category
     * Only administrators can update categories.
     * @param id the id of the category to update
     * @param categoryDetails the category details to update
     * @return the updated category
     * @throws ResourceNotFoundException if the category does not exist
     * @throws UnauthorizedException if the user is not an admin
     */
    public Category update(Long id, Category categoryDetails) {
        // Validate permissions: only admin can update categories
        // Defense in depth: even though Spring Security protects the endpoint,
        // we validate here in case the service is called directly
        if (!isAdmin()) {
            throw new UnauthorizedException("Only administrators can update categories");
        }
        
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        
        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        category.setIcon(categoryDetails.getIcon());
        category.setProductCount(categoryDetails.getProductCount());
        
        return categoryRepository.save(category);
    }

    /**
     * Delete a category
     * Only administrators can delete categories.
     * @param id the id of the category to delete
     * @throws ResourceNotFoundException if the category does not exist
     * @throws UnauthorizedException if the user is not an admin
     */
    public void delete(Long id) {
        // Validate permissions: only admin can delete categories
        // Defense in depth: even though Spring Security protects the endpoint,
        // we validate here in case the service is called directly
        if (!isAdmin()) {
            throw new UnauthorizedException("Only administrators can delete categories");
        }
        
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        categoryRepository.delete(category);
    }
}
