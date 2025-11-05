package com.example.springbackend.service;

import com.example.springbackend.dto.OrderDTO;
import java.util.List;
import java.util.Optional;

public interface OrderService {
    OrderDTO createOrder(OrderDTO dto);
    List<OrderDTO> getOrdersByUser(Long userId);
    Optional<OrderDTO> getOrderById(Long id);
}
