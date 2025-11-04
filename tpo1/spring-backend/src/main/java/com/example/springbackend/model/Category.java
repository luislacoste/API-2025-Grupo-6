package com.example.springbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Category Entity
 * Represents a product category in the e-commerce system
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(length = 500)
    private String description;
    
    private String icon;
    
    @Column(name = "product_count")
    private Integer productCount;
    
    @PrePersist
    protected void onCreate() {
        if (productCount == null) {
            productCount = 0;
        }
    }
}
