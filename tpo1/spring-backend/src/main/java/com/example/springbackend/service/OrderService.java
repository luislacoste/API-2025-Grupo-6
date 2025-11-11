package com.example.springbackend.service;

import com.example.springbackend.model.Order;
import com.example.springbackend.dto.OrderDTO;
import com.example.springbackend.mapping.OrderMapper;
import com.example.springbackend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    private final OrderMapper orderMapper;

    /**
     * Get all orders
     */
    private List<Order> findAllEntities() {
        return orderRepository.findAll();
    }

    /**
     * Public: get all orders as DTOs
     */
    public List<OrderDTO> getAllOrders() {
        return orderMapper.toDtoList(findAllEntities());
    }

    /**
     * Get order by ID
     */
    private Optional<Order> findByIdEntity(Long id) {
        return orderRepository.findById(id);
    }

    /**
     * Public: get order by id as ResponseEntity
     */
    public ResponseEntity<OrderDTO> getOrderById(Long id) {
        return findByIdEntity(id)
                .map(o -> ResponseEntity.ok(orderMapper.toDto(o)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Create a new order
     */
    private Order saveEntity(Order order) {
        if (order.getCreatedAt() == null) {
            order.setCreatedAt(Instant.now());
        }
        return orderRepository.save(order);
    }

    /**
     * Public: create order from DTO and return ResponseEntity with DTO
     */
    public ResponseEntity<OrderDTO> createOrder(OrderDTO orderDto) {
        Order order = orderMapper.toEntity(orderDto);
        Order saved = saveEntity(order);
        return ResponseEntity.ok(orderMapper.toDto(saved));
    }

    // entity-level update helper removed (not used)

    /**
     * Public: update existing order or create if not exists. Returns ResponseEntity<OrderDTO>
     */
    public ResponseEntity<OrderDTO> updateOrCreateOrder(Long id, OrderDTO updatedOrderDto) {
        Optional<Order> existing = findByIdEntity(id);
        if (existing.isPresent()) {
            Order order = existing.get();
            order.setUserId(updatedOrderDto.getUserId());
            order.setTotal(updatedOrderDto.getTotal());
            order.setStatus(updatedOrderDto.getStatus());
            Order saved = orderRepository.save(order);
            return ResponseEntity.ok(orderMapper.toDto(saved));
        } else {
            Order newOrder = orderMapper.toEntity(updatedOrderDto);
            Order saved = saveEntity(newOrder);
            return ResponseEntity.ok(orderMapper.toDto(saved));
        }
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

    /**
     * Public: delete order and return ResponseEntity
     */
    public ResponseEntity<Void> deleteOrderResponse(Long id) {
        if (!exists(id)) return ResponseEntity.notFound().build();
        delete(id);
        return ResponseEntity.noContent().build();
    }
}
