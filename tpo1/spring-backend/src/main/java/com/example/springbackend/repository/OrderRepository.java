package com.example.springbackend.repository;

import com.example.springbackend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
	/**
	 * Encuentra pedidos por el id del usuario que los creó.
	 */
	List<Order> findByUserId(Long userId);

	/**
	 * Encuentra pedidos por estado (ej: PENDIENTE, COMPLETADO, CANCELADO)
	 */
	List<Order> findByStatus(String status);

	/**
	 * Encuentra pedidos de un usuario con un estado concreto.
	 */
	List<Order> findByUserIdAndStatus(Long userId, String status);
}
