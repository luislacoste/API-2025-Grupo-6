package com.example.springbackend.controller;

import com.example.springbackend.model.Product;
import com.example.springbackend.service.ProductService;
import com.example.springbackend.dto.ProductDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    /**
     * GET /products
     * Returns a list of all products.
     * Example:
     * curl -s "http://localhost:3000/products" | jq .
     */
    public List<ProductDTO> all() {
    return productService.findAll().stream().map(this::toDto).toList();
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
    public ResponseEntity<ProductDTO> getById(@PathVariable Long id) {
    return productService.findById(id).map(prod -> ResponseEntity.ok(toDto(prod))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping(params = "category")
    /**
     * GET /products?category={category}
     * Returns products that belong to the given category.
     * Example:
     * curl -s "http://localhost:3000/products?category=Electronics" | jq .
     */
    public List<ProductDTO> byCategory(@RequestParam String category) {
    return productService.findByCategory(category).stream().map(this::toDto).toList();
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
    public ResponseEntity<ProductDTO> create(@Valid @RequestBody ProductDTO productDto) {
    Product product = fromDto(productDto);
    Product saved = productService.create(product);
    return ResponseEntity.created(URI.create("/products/" + saved.getId())).body(toDto(saved));
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
    public ResponseEntity<ProductDTO> update(@PathVariable Long id, @Valid @RequestBody ProductDTO productDto) {
    var savedOpt = productService.update(id, fromDto(productDto));
    return savedOpt.map(prod -> ResponseEntity.ok(toDto(prod))).orElseGet(() -> ResponseEntity.notFound().build());
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
        if (!productService.exists(id)) return ResponseEntity.notFound().build();
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Mapping helpers
    private ProductDTO toDto(Product p) {
        return new ProductDTO(
                p.getId(),
                p.getName(),
                p.getPrice(),
                p.getCategory(),
                p.getDescription(),
                p.getImage(),
                p.getStock(),
                p.getCreatedAt()
        );
    }

    private Product fromDto(ProductDTO dto) {
        Product p = new Product();
        p.setName(dto.getName());
        p.setPrice(dto.getPrice());
        p.setCategory(dto.getCategory());
        p.setDescription(dto.getDescription());
        p.setImage(dto.getImage());
        p.setStock(dto.getStock());
        p.setCreatedAt(dto.getCreatedAt());
        return p;
    }
}