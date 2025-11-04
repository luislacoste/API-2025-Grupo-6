package com.example.springbackend.controller;

import com.example.springbackend.model.Product;
import com.example.springbackend.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")

public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    /**
     * GET /products
     * Returns a list of all products.
     * Example:
     * curl -s "http://localhost:3000/products" | jq .
     */
    public List<Product> all() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    /**
     * GET /products/{id}
     * Returns the product with the specified id.
     * Responses:
     * - 200 OK with the product JSON when found
     * - 404 Not Found when no product exists with that id
     * Example:
     * curl -i "http://localhost:3000/products/1"
     */
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        Optional<Product> p = productRepository.findById(id);
        return p.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping(params = "category")
    /**
     * GET /products?category={category}
     * Returns products that belong to the given category.
     * Example:
     * curl -s "http://localhost:3000/products?category=Electronics" | jq .
     */
    public List<Product> byCategory(@RequestParam String category) {
        return productRepository.findByCategory(category);
    }

    @PostMapping
    /**
     * POST /products
     * Creates a new product. If createdAt is null it defaults to now().
     * Returns 201 Created with Location header set to /products/{id}
     * Example:
     * curl -i -X POST "http://localhost:3000/products" \
     *   -H "Content-Type: application/json" \
     *   -d '{"name":"Phone","price":59900,"category":"Electronics","description":"Smartphone","image":"/img/phone.png","stock":10,"userId":1}'
     */
    public ResponseEntity<Product> create(@RequestBody Product product) {
        if (product.getCreatedAt() == null) product.setCreatedAt(Instant.now());
        Product saved = productRepository.save(product);
        return ResponseEntity.created(URI.create("/products/" + saved.getId())).body(saved);
    }

    @PutMapping("/{id}")
    /**
     * PUT /products/{id}
     * Updates an existing product's fields. Returns 200 OK with the updated product,
     * or 404 Not Found if the id doesn't exist.
     * Example:
     * curl -i -X PUT "http://localhost:3000/products/1" \
     *   -H "Content-Type: application/json" \
     *   -d '{"name":"Phone X","price":64900,"category":"Electronics","description":"Updated","image":"/img/phone-x.png","stock":8,"userId":1}'
     */
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product product) {
        Optional<Product> existing = productRepository.findById(id);
        if (existing.isEmpty()) return ResponseEntity.notFound().build();
        Product p = existing.get();
        p.setName(product.getName());
        p.setPrice(product.getPrice());
        p.setCategory(product.getCategory());
        p.setDescription(product.getDescription());
        p.setImage(product.getImage());
        p.setStock(product.getStock());
        p.setUserId(product.getUserId());
        Product saved = productRepository.save(p);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    /**
     * DELETE /products/{id}
     * Deletes the product with the given id. Returns:
     * - 204 No Content when deletion succeeds
     * - 404 Not Found when the id does not exist
     * Example:
     * curl -i -X DELETE "http://localhost:3000/products/1"
     */
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!productRepository.existsById(id)) return ResponseEntity.notFound().build();
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}