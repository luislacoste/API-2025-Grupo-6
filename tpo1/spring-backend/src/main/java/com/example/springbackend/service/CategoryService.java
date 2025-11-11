package com.example.springbackend.service;

import com.example.springbackend.model.Category;
import com.example.springbackend.dto.CategoryDTO;
import com.example.springbackend.mapping.CategoryMapper;
import com.example.springbackend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Category Service
 * Business logic layer for Category operations (DTO-aware)
 */
@Service
@Transactional
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    // Entity helpers
    private List<Category> findAllEntities() {
        return categoryRepository.findAll();
    }

    private Optional<Category> findByIdEntity(Long id) {
        return categoryRepository.findById(id);
    }

    private Category saveEntity(Category category) {
        if (category.getProductCount() == null) {
            category.setProductCount(0);
        }
        return categoryRepository.save(category);
    }

    // Public DTO-aware API used by controllers
    public List<CategoryDTO> findAll() {
        return categoryMapper.toDtoList(findAllEntities());
    }

    public ResponseEntity<CategoryDTO> findById(Long id) {
        return findByIdEntity(id)
                .map(cat -> ResponseEntity.ok(categoryMapper.toDto(cat)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    public ResponseEntity<CategoryDTO> create(CategoryDTO dto) {
        Category entity = categoryMapper.toEntity(dto);
        Category saved = saveEntity(entity);
        return ResponseEntity.created(java.net.URI.create("/categories/" + saved.getId())).body(categoryMapper.toDto(saved));
    }

    public ResponseEntity<CategoryDTO> update(Long id, CategoryDTO dto) {
        Category details = categoryMapper.toEntity(dto);
        return categoryRepository.findById(id)
                .map(cat -> {
                    cat.setName(details.getName());
                    cat.setDescription(details.getDescription());
                    cat.setIcon(details.getIcon());
                    cat.setProductCount(details.getProductCount());
                    Category saved = categoryRepository.save(cat);
                    return ResponseEntity.ok(categoryMapper.toDto(saved));
                })
                .orElseGet(() -> create(dto));
    }

    public ResponseEntity<Void> deleteResponse(Long id) {
        if (!categoryRepository.existsById(id)) return ResponseEntity.notFound().build();
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    public boolean exists(Long id) {
        return categoryRepository.existsById(id);
    }
}
