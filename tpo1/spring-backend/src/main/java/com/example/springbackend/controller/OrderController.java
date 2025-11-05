package com.example.springbackend.controller;

import com.example.springbackend.model.Order;
import com.example.springbackend.repository.OrderRepository;
import com.example.springbackend.dto.OrderDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/orders")
// TODO @CrossOrigin(origins = "*")  borrar
public class OrderController {

    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // Obtener todos los pedidos
    @GetMapping
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream().map(this::toDto).toList();
    }

    // Obtener un pedido por ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id).map(o -> ResponseEntity.ok(toDto(o)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Crear un nuevo pedido
    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody OrderDTO orderDto) {
        Order order = fromDto(orderDto);
        Order saved = orderRepository.save(order);
        return ResponseEntity.ok(toDto(saved));
    }

    // Actualizar un pedido existente
    @PutMapping("/{id}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable Long id, @Valid @RequestBody OrderDTO updatedOrderDto) {
        return orderRepository.findById(id)
                .map(order -> {
                    order.setUserId(updatedOrderDto.getUserId());
                    order.setTotal(updatedOrderDto.getTotal());
                    order.setStatus(updatedOrderDto.getStatus());
                    Order saved = orderRepository.save(order);
                    return ResponseEntity.ok(toDto(saved));
                })
                .orElseGet(() -> {
                    Order newOrder = fromDto(updatedOrderDto);
                    Order saved = orderRepository.save(newOrder);
                    return ResponseEntity.ok(toDto(saved));
                });
    }

    // Eliminar un pedido por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        if (!orderRepository.existsById(id)) return ResponseEntity.notFound().build();
        orderRepository.deleteById(id);
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
        o.setUserId(dto.getUserId());
        o.setCreatedAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : o.getCreatedAt());
        o.setTotal(dto.getTotal());
        o.setStatus(dto.getStatus());
        return o;
    }
}
