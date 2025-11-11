package com.example.springbackend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    
    private Long id;
    
    // userId is not required in DTO - it's set automatically by the service from the authenticated user
    private Long userId;
    
    private Instant createdAt;
    
    @NotNull(message = "Total is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Total must be greater than 0")
    private Double total;
    
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "PENDIENTE|COMPLETADO|CANCELADO", message = "Status must be PENDIENTE, COMPLETADO, or CANCELADO")
    private String status;
}
