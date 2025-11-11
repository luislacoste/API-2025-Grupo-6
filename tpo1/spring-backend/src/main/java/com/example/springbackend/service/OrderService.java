package com.example.springbackend.service;

import com.example.springbackend.model.Order;
import com.example.springbackend.model.Usuario;
import com.example.springbackend.repository.OrderRepository;
import com.example.springbackend.repository.UsuarioRepository;
import com.example.springbackend.exception.ResourceNotFoundException;
import com.example.springbackend.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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
    private final UsuarioRepository usuarioRepository;

    /**
     * Get all orders
     */
    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    /**
     * Get order by ID
     */
    public Optional<Order> findById(Long id) {
        return orderRepository.findById(id);
    }

    /**
     * Get the currently authenticated user
     * @return the authenticated user
     * @throws ResourceNotFoundException if no user is authenticated
     */
    private Usuario getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String email = userDetails.getUsername();
            return usuarioRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        } else {
            throw new ResourceNotFoundException("Authentication required to perform this operation");
        }
    }

    /**
     * Check if the authenticated user is an admin
     * @return true if the user is an admin
     */
    private boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getAuthorities() != null) {
            return authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .anyMatch(authority -> authority.equals("ROLE_ADMIN"));
        }
        return false;
    }

    /**
     * Check if the authenticated user is the owner of the order or an admin
     * @param order the order to check
     * @return true if the user is the owner or an admin
     */
    private boolean isOwnerOrAdmin(Order order) {
        if (isAdmin()) {
            return true;
        }
        Usuario usuario = getAuthenticatedUser();
        return order.getUserId() != null && order.getUserId().equals(usuario.getId());
    }

    /**
     * Create a new order
     * The userId is automatically set from the authenticated user.
     */
    public Order create(Order order) {
        if (order.getCreatedAt() == null) {
            order.setCreatedAt(Instant.now());
        }
        
        // Set userId from authenticated user
        Usuario usuario = getAuthenticatedUser();
        order.setUserId(usuario.getId());
        
        return orderRepository.save(order);
    }

    /**
     * Update an existing order
     * Only the owner of the order or an admin can update it.
     * The userId cannot be changed (security: prevent manipulation).
     * @param id the id of the order to update
     * @param orderDetails the order details to update
     * @return the updated order
     * @throws ResourceNotFoundException if the order does not exist
     * @throws UnauthorizedException if the user is not the owner or an admin
     */
    public Order update(Long id, Order orderDetails) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        
        // Validate permissions: only owner or admin can update
        if (!isOwnerOrAdmin(order)) {
            throw new UnauthorizedException("You are not authorized to update this order");
        }
        
        // Update fields (but not userId - security: prevent manipulation)
        order.setTotal(orderDetails.getTotal());
        order.setStatus(orderDetails.getStatus());
        // userId is not updated - it remains the original owner
        
        return orderRepository.save(order);
    }

    /**
     * Delete an order
     * Only the owner of the order or an admin can delete it.
     * @param id the id of the order to delete
     * @throws ResourceNotFoundException if the order does not exist
     * @throws UnauthorizedException if the user is not the owner or an admin
     */
    public void delete(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        
        // Validate permissions: only owner or admin can delete
        if (!isOwnerOrAdmin(order)) {
            throw new UnauthorizedException("You are not authorized to delete this order");
        }
        
        orderRepository.delete(order);
    }
}
