package com.example.springbackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.springbackend.dto.LoginRequest;
import com.example.springbackend.dto.RegisterRequest;
import com.example.springbackend.dto.AuthResponse;
import com.example.springbackend.service.AuthenticationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    // curl -i -X POST "http://localhost:3000/api/auth/register" \
    // -H "Content-Type: application/json" \
    // -d '{
    //     "nombre": "Juan",
    //     "apellido": "Perez",
    //     "email": "juan.perez@example.com",
    //     "password": "secret123"
    // }'
    //http://localhost:8080/api/auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    // curl -i -X POST "http://localhost:3000/api/auth/login" \
    // -H "Content-Type: application/json" \
    // -d '{
    //     "email": "juan.perez@example.com",
    //     "password": "secret123"
    // }'
    //http://localhost:8080/api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }
}
