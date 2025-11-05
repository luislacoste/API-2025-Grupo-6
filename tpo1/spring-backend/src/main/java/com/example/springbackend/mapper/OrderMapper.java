package com.example.springbackend.mapper;

import com.example.springbackend.dto.OrderDTO;
import com.example.springbackend.model.Order;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    public OrderDTO toDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setTotal(order.getTotal());
        dto.setCreatedAt(order.getCreatedAt());
        return dto;
    }

    public Order toEntity(OrderDTO dto) {
        Order order = new Order();
        order.setTotal(dto.getTotal());
        return order;
    }
}

