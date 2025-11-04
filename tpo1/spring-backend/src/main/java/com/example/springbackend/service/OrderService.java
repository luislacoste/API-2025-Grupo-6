package com.example.springbackend.service;

import com.example.springbackend.model.Order;
import com.example.springbackend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Order Service
 * Business logic layer for Order operations
 */
@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    /**
     * Get all orders
     */
    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    /**
     * Get order by ID
     */
    public Optional<Order> findById(Long id) {
        return orderRepository.findById(id);
    }

    /**
     * Create a new order
     */
    public Order create(Order order) {
        if (order.getCreatedAt() == null) {
            order.setCreatedAt(Instant.now());
        }
        return orderRepository.save(order);
    }

    /**
     * Update an existing order
     */
    public Optional<Order> update(Long id, Order orderDetails) {
        return orderRepository.findById(id)
                .map(order -> {
                    order.setUserId(orderDetails.getUserId());
                    order.setTotal(orderDetails.getTotal());
                    order.setStatus(orderDetails.getStatus());
                    return orderRepository.save(order);
                });
    }

    /**
     * Delete an order
     */
    public boolean delete(Long id) {
        if (orderRepository.existsById(id)) {
            orderRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Check if order exists
     */
    public boolean exists(Long id) {
        return orderRepository.existsById(id);
    }
}
