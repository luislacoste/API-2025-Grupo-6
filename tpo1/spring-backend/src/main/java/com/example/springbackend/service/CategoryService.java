package com.example.springbackend.service;

import com.example.springbackend.model.Category;
import com.example.springbackend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
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
     * Create a new category
     */
    public Category create(Category category) {
        if (category.getProductCount() == null) {
            category.setProductCount(0);
        }
        return categoryRepository.save(category);
    }

    /**
     * Update an existing category
     */
    public Optional<Category> update(Long id, Category categoryDetails) {
        return categoryRepository.findById(id)
                .map(category -> {
                    category.setName(categoryDetails.getName());
                    category.setDescription(categoryDetails.getDescription());
                    category.setIcon(categoryDetails.getIcon());
                    category.setProductCount(categoryDetails.getProductCount());
                    return categoryRepository.save(category);
                });
    }

    /**
     * Delete a category
     */
    public boolean delete(Long id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Check if category exists
     */
    public boolean exists(Long id) {
        return categoryRepository.existsById(id);
    }
}
