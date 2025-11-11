package com.example.springbackend.mapping;

import java.util.List;
import com.example.springbackend.dto.OrderDTO;
import com.example.springbackend.model.Order;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface OrderMapper {
    Order toEntity(OrderDTO dto);

    OrderDTO toDto(Order entity);

    List<OrderDTO> toDtoList(List<Order> entities);

}
