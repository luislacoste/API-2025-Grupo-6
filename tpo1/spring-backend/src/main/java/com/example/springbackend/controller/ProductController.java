package com.example.springbackend.controller;

import com.example.springbackend.service.ProductService;
import com.example.springbackend.dto.ProductDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import com.example.springbackend.model.Usuario;

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
        return productService.findAll();
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
    public ProductDTO getById(@PathVariable Long id) {
        return productService.findById(id);
    }

    @GetMapping(params = "category")
    /**
     * GET /products?category={category}
     * Returns products that belong to the given category.
     * Example:
     * curl -s "http://localhost:3000/products?category=Electronics" | jq .
     */
    public List<ProductDTO> byCategory(@RequestParam String category) {
        return productService.findByCategory(category);
    }

    @PostMapping
    /**
     * POST /products
     * Creates a new product. If createdAt is null it defaults to now().
     * Returns 201 Created with Location header set to /products/{id}
     * Example:
     * curl -i -X POST "http://localhost:3000/products" \
     * -H "Content-Type: application/json" \
     * -d
     * '{"name":"Phone","price":59900,"category":"Electronics","description":"Smartphone","image":"/img/phone.png","stock":10,"userId":1}'
     */
    public ProductDTO create(@Valid @RequestBody ProductDTO productDto) {
        // ProductDTO saved = productService.createFrom(productDto);
        // return ResponseEntity.created(URI.create("/products/" +
        // saved.getId())).body(saved);
        return productService.create(productDto);
    }

    @PutMapping("/{id}")
    /**
     * PUT /products/{id}
     * Updates an existing product's fields. Returns 200 OK with the updated
     * product,
     * or 404 Not Found if the id doesn't exist.
     * Example:
     * curl -i -X PUT "http://localhost:3000/products/1" \
     * -H "Content-Type: application/json" \
     * -d '{"name":"Phone
     * X","price":64900,"category":"Electronics","description":"Updated","image":"/img/phone-x.png","stock":8,"userId":1}'
     */
    public ProductDTO update(@PathVariable Long id, @Valid @RequestBody ProductDTO productDto) {
        return productService.update(id, productDto);
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
        if (!productService.exists(id))
            return ResponseEntity.notFound().build();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof Usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Usuario usuario = (Usuario) auth.getPrincipal();
        boolean deleted = productService.deleteIfOwnerOrAdmin(id, usuario);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/my-products")
    public ResponseEntity<List<ProductDTO>> myProducts() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof Usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Usuario usuario = (Usuario) auth.getPrincipal();
        Long userId = usuario.getId();
        List<ProductDTO> list = productService.findByUserIdDto(userId);
        return ResponseEntity.ok(list);
    }

}