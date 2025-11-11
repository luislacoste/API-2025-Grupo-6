package com.example.springbackend.dto;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para exponer recursos de Product desde el backend.
 * Usamos Lombok para reducir el boilerplate (getters/setters/constructors/builder).
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private Integer price;
    private String category;
    private String description;
    private String image;
    private Integer stock;
    private Instant createdAt;
    private Long userId;
}
