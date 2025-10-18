package com.example.springbackend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.springbackend.dto.LoginRequest;
import com.example.springbackend.dto.RegisterRequest;
import com.example.springbackend.model.Role;
import com.example.springbackend.model.Usuario;
import com.example.springbackend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthenticationService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public String register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Usuario usuario = Usuario.builder()
                    .nombre(request.getNombre())
                    .apellido(request.getApellido())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(Role.USER)
                    .build();

        usuarioRepository.save(usuario);
        return "User registered successfully";
    }

    public String authenticate(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        return "Login successful";
    }
}
