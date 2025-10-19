package com.example.springbackend.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ID del usuario que realizó el pedido
    private Long userId;

    // Fecha de creación del pedido
    private Instant createdAt = Instant.now();

    // Monto total del pedido
    private Double total;

    // Estado del pedido (ej: "PENDIENTE", "COMPLETADO", "CANCELADO")
    private String status;

    // Constructor vacío requerido por JPA
    public Order() {}

    // Constructor con campos
    public Order(Long userId, Double total, String status) {
        this.userId = userId;
        this.total = total;
        this.status = status;
        this.createdAt = Instant.now();
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
