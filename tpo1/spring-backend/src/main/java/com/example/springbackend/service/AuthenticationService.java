package com.example.springbackend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.springbackend.dto.LoginRequest;
import com.example.springbackend.dto.RegisterRequest;
import com.example.springbackend.dto.AuthResponse;
import com.example.springbackend.exception.EmailAlreadyExistsException;
import com.example.springbackend.model.Role;
import com.example.springbackend.model.Usuario;
import com.example.springbackend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthenticationService {

        private final UsuarioRepository usuarioRepository;
        private final PasswordEncoder passwordEncoder;
        private final AuthenticationManager authenticationManager;
        private final JwtUtil jwtUtil;

        public AuthResponse register(RegisterRequest request) {
                if (usuarioRepository.existsByEmail(request.getEmail())) {
                        throw new EmailAlreadyExistsException(
                                        "There is already a registered user with the email: " + request.getEmail());
                }

                Usuario usuario = Usuario.builder()
                                .nombre(request.getNombre())
                                .apellido(request.getApellido())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(Role.USER)
                                .build();

                usuarioRepository.save(usuario);

                // Generate JWT token for the new user
                Set<String> roles = usuario.getAuthorities().stream()
                                .map(grantedAuthority -> grantedAuthority.getAuthority())
                                .collect(Collectors.toSet());

                String token = jwtUtil.generateToken(usuario.getEmail(), roles);

                return AuthResponse.builder()
                                .id(usuario.getId())
                                .nombre(usuario.getNombre())
                                .apellido(usuario.getApellido())
                                .email(usuario.getEmail())
                                .token(token)
                                .build();
        }

        public AuthResponse authenticate(LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new IllegalStateException("User not found after authentication"));

                // Generate JWT token
                Set<String> roles = usuario.getAuthorities().stream()
                                .map(grantedAuthority -> grantedAuthority.getAuthority())
                                .collect(Collectors.toSet());

                String token = jwtUtil.generateToken(usuario.getEmail(), roles);

                return AuthResponse.builder()
                                .id(usuario.getId())
                                .nombre(usuario.getNombre())
                                .apellido(usuario.getApellido())
                                .email(usuario.getEmail())
                                .token(token)
                                .build();
        }
}