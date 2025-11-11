package com.example.springbackend.dto;

import jakarta.validation.constraints.*;
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
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be greater than or equal to 0")
    private Integer price;
    
    @NotBlank(message = "Category is required")
    @Size(min = 2, max = 50, message = "Category must be between 2 and 50 characters")
    private String category;
    
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;
    
    private String image;
    
    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock must be greater than or equal to 0")
    private Integer stock;
    
    private Instant createdAt;
    private Long userId;
}
