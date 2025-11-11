package com.example.springbackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.springbackend.dto.LoginRequestDTO;
import com.example.springbackend.dto.RegisterRequestDTO;
import com.example.springbackend.dto.AuthResponseDTO;
import com.example.springbackend.service.AuthenticationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    /**
     * POST /api/auth/register
     * Registers a new user.
     * Returns 201 Created with the user information and JWT token.
     * Example:
     * curl -i -X POST "http://localhost:3000/api/auth/register" \
     *   -H "Content-Type: application/json" \
     *   -d '{
     *     "nombre": "Juan",
     *     "apellido": "Perez",
     *     "email": "juan.perez@example.com",
     *     "password": "secret123"
     *   }'
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        AuthResponseDTO response = authenticationService.register(request);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(response);
    }

    /**
     * POST /api/auth/login
     * Authenticates a user and returns a JWT token.
     * Example:
     * curl -i -X POST "http://localhost:3000/api/auth/login" \
     *   -H "Content-Type: application/json" \
     *   -d '{
     *     "email": "juan.perez@example.com",
     *     "password": "secret123"
     *   }'
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }
}
