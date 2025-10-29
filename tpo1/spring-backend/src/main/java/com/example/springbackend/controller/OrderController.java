package com.example.springbackend.controller;

import com.example.springbackend.model.Order;
import com.example.springbackend.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

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
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Obtener un pedido por ID
    @GetMapping("/{id}")
    public Optional<Order> getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id);
    }

    // Crear un nuevo pedido
    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderRepository.save(order);
    }

    // Actualizar un pedido existente
    @PutMapping("/{id}")
    public Order updateOrder(@PathVariable Long id, @RequestBody Order updatedOrder) {
        return orderRepository.findById(id)
                .map(order -> {
                    order.setUserId(updatedOrder.getUserId());
                    order.setTotal(updatedOrder.getTotal());
                    order.setStatus(updatedOrder.getStatus());
                    return orderRepository.save(order);
                })
                .orElseGet(() -> {
                    // If the order doesn't exist, save the provided updatedOrder as a new entity
                    // (assumes the persistence layer will generate an ID)
                    return orderRepository.save(updatedOrder);
                });
    }

    // Eliminar un pedido por ID
    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderRepository.deleteById(id);
    }
}
