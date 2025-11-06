package com.example.springbackend.dto;

import java.time.Instant;

public class OrderDTO {
    private Long id;
    private Long userId;
    private Instant createdAt;
    private Double total;
    private String status;

    public OrderDTO() {}

    public OrderDTO(Long id, Long userId, Instant createdAt, Double total, String status) {
        this.id = id;
        this.userId = userId;
        this.createdAt = createdAt;
        this.total = total;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
