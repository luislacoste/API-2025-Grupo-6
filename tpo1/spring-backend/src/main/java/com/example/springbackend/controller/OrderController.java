package com.example.springbackend.controller;

import com.example.springbackend.model.Order;
import com.example.springbackend.service.OrderService;
import com.example.springbackend.dto.OrderDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Obtener todos los pedidos
    @GetMapping
    public List<OrderDTO> getAllOrders() {
    return orderService.findAll().stream().map(this::toDto).toList();
    }

    // Obtener un pedido por ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
    return orderService.findById(id).map(o -> ResponseEntity.ok(toDto(o)))
        .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Crear un nuevo pedido
    @PostMapping
    /**
     * POST /orders
     * Creates a new order. The userId is automatically set from the authenticated user by the service layer.
     * Returns 201 Created with the created order and Location header.
     * Example:
     * curl -i -X POST "http://localhost:3000/orders" \
     *   -H "Content-Type: application/json" \
     *   -H "Authorization: Bearer <token>" \
     *   -d '{"total":100.50,"status":"PENDIENTE"}'
     */
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody OrderDTO orderDto) {
        Order order = fromDto(orderDto);
        Order saved = orderService.create(order);
        return ResponseEntity.created(URI.create("/orders/" + saved.getId())).body(toDto(saved));
    }

    // Actualizar un pedido existente
    @PutMapping("/{id}")
    /**
     * PUT /orders/{id}
     * Updates an existing order. Only the owner or an admin can update it.
     * The userId cannot be changed (set automatically from authenticated user).
     * Returns 200 OK with the updated order, or 404 Not Found if the id doesn't exist.
     * Example:
     * curl -i -X PUT "http://localhost:3000/orders/1" \
     *   -H "Content-Type: application/json" \
     *   -H "Authorization: Bearer <token>" \
     *   -d '{"total":150.75,"status":"COMPLETADO"}'
     */
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable Long id, @Valid @RequestBody OrderDTO updatedOrderDto) {
        Order order = fromDto(updatedOrderDto);
        Order saved = orderService.update(id, order);
        return ResponseEntity.ok(toDto(saved));
    }

    // Eliminar un pedido por ID
    @DeleteMapping("/{id}")
    /**
     * DELETE /orders/{id}
     * Deletes the order with the given id. Only the owner or an admin can delete it.
     * Returns:
     * - 204 No Content when deletion succeeds
     * - 404 Not Found when the id does not exist (handled by GlobalExceptionHandler)
     * Example:
     * curl -i -X DELETE "http://localhost:3000/orders/1" \
     *   -H "Authorization: Bearer <token>"
     */
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Mapping helpers
    private OrderDTO toDto(Order o) {
        return OrderDTO.builder()
                .id(o.getId())
                .userId(o.getUserId())
                .createdAt(o.getCreatedAt())
                .total(o.getTotal())
                .status(o.getStatus())
                .build();
    }

    private Order fromDto(OrderDTO dto) {
        Order o = new Order();
        // userId is not set from DTO - it's set automatically by the service from the authenticated user
        o.setCreatedAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : null);
        o.setTotal(dto.getTotal());
        o.setStatus(dto.getStatus());
        return o;
    }
}
