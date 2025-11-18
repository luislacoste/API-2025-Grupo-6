package com.example.springbackend.mapping;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import com.example.springbackend.dto.OrderDTO;
import com.example.springbackend.model.Order;

@Component
public class OrderMapper {

    public Order toEntity(OrderDTO dto) {
        if (dto == null) return null;
        Order o = new Order();
        o.setUserId(dto.getUserId());
        o.setCreatedAt(dto.getCreatedAt());
        o.setTotal(dto.getTotal());
        o.setStatus(dto.getStatus());
        return o;
    }

    public OrderDTO toDto(Order entity) {
        if (entity == null) return null;
        return new OrderDTO(entity.getId(), entity.getUserId(), entity.getCreatedAt(), entity.getTotal(),
                entity.getStatus());
    }

    public List<OrderDTO> toDtoList(List<Order> entities) {
        if (entities == null) return null;
        return entities.stream().map(this::toDto).collect(Collectors.toList());
    }

}
