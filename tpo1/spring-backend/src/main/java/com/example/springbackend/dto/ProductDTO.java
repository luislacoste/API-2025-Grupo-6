package com.example.springbackend.dto;

import java.time.Instant;

public class ProductDTO {
    private Long id;
    private String name;
    private Integer price;
    private String category;
    private String description;
    private String image;
    private Integer stock;
    private Instant createdAt;

    public ProductDTO() {}

    // Constructor completo (útil para mapear desde la entidad)
    public ProductDTO(Long id, String name, Integer price, String category, String description,
                      String image, Integer stock, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.description = description;
        this.image = image;
        this.stock = stock;
        this.createdAt = createdAt;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getPrice() { return price; }
    public void setPrice(Integer price) { this.price = price; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
