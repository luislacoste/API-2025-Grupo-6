package com.example.springbackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
// import org.springframework.web.bind.annotation.CrossOrigin; TODO: borrar

import com.example.springbackend.dto.LoginRequestDTO;
import com.example.springbackend.dto.RegisterRequestDTO;
import com.example.springbackend.dto.AuthResponseDTO;
import com.example.springbackend.service.AuthenticationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
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
    public ResponseEntity<AuthResponseDTO> register(@RequestBody RegisterRequestDTO request) {
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
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }
}
