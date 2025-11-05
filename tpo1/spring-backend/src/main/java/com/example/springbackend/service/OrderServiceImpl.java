package com.example.springbackend.service;

import com.example.springbackend.dto.OrderDTO;
import com.example.springbackend.mapper.OrderMapper;
import com.example.springbackend.model.Order;
import com.example.springbackend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    @Override
    public OrderDTO createOrder(OrderDTO dto) {
        Order order = orderMapper.toEntity(dto);
        order = orderRepository.save(order);
        return orderMapper.toDTO(order);
    }

    @Override
    public List<OrderDTO> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId)
                .stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<OrderDTO> getOrderById(Long id) {
        return orderRepository.findById(id)
                .map(orderMapper::toDTO);
    }
}
