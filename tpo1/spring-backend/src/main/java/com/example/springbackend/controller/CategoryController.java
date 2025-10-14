package com.example.springbackend.controller;

import com.example.springbackend.model.Category;
import com.example.springbackend.repository.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    /**
     * GET /categories
     * Returns a list of all categories.
     * Example:
     * curl -s "http://localhost:3000/categories" | jq .
     */
    public List<Category> all() {
        return categoryRepository.findAll();
    }

    @GetMapping("/{id}")
    /**
     * GET /categories/{id}
     * Returns the category with the specified id.
     * Responses:
     * - 200 OK with the category JSON when found
     * - 404 Not Found when no category exists with that id
     * Example:
     * curl -i "http://localhost:3000/categories/1"
     */
    public ResponseEntity<Category> getById(@PathVariable Long id) {
        Optional<Category> c = categoryRepository.findById(id);
        return c.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    /**
     * POST /categories
     * Creates a new category. If productCount is null it defaults to 0.
     * Returns 201 Created with Location header set to /categories/{id}
     * Example:
     * curl -i -X POST "http://localhost:3000/categories" \
     *   -H "Content-Type: application/json" \
     *   -d '{"name":"Books","description":"All kinds of books","icon":"book","productCount":0}'
     */
    public ResponseEntity<Category> create(@RequestBody Category category) {
        if (category.getProductCount() == null) category.setProductCount(0);
        var saved = categoryRepository.save(category);
        return ResponseEntity.created(URI.create("/categories/" + saved.getId())).body(saved);
    }

    @PutMapping("/{id}")
    /**
     * PUT /categories/{id}
     * Updates an existing category's fields (name, description, icon, productCount).
     * Returns 200 OK with the updated category, or 404 Not Found if the id doesn't exist.
     * Example:
     * curl -i -X PUT "http://localhost:3000/categories/1" \
     *   -H "Content-Type: application/json" \
     *   -d '{"name":"Electronics","description":"Gadgets","icon":"devices","productCount":42}'
     */
    public ResponseEntity<Category> update(@PathVariable Long id, @RequestBody Category category) {
        Optional<Category> existing = categoryRepository.findById(id);
        if (existing.isEmpty()) return ResponseEntity.notFound().build();
        Category c = existing.get();
        c.setName(category.getName());
        c.setDescription(category.getDescription());
        c.setIcon(category.getIcon());
        c.setProductCount(category.getProductCount());
        var saved = categoryRepository.save(c);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    /**
     * DELETE /categories/{id}
     * Deletes the category with the given id. Returns:
     * - 204 No Content when deletion succeeds
     * - 404 Not Found when the id does not exist
     * Example:
     * curl -i -X DELETE "http://localhost:3000/categories/1"
     */
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!categoryRepository.existsById(id)) return ResponseEntity.notFound().build();
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}