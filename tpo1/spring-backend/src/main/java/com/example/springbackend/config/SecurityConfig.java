package com.example.springbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.example.springbackend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

/**
 * Configuración de seguridad de la aplicación.
 * Define autenticación, autorización y permisos por ruta.
 */

@Configuration // Clase de configuración de Spring
@EnableWebSecurity // Activa Spring Security
@RequiredArgsConstructor // Inyección de dependencias por constructor
public class SecurityConfig {

    // Repositorio para acceder a usuarios en la BD
    private final UsuarioRepository usuarioRepository;

    /**
     * Servicio que carga usuarios desde la BD por email.
     * Usado por Spring Security durante el login.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    /**
     * Gestor de autenticación de Spring Security.
     * Necesario para procesos de login personalizados.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Codificador de contraseñas usando BCrypt.
     * BCrypt es seguro, irreversible e incluye salt automáticamente.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configuración de la cadena de filtros de seguridad.
     * Define qué rutas son públicas, cuáles requieren autenticación,
     * y cuáles necesitan roles específicos.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Desactiva CSRF (para APIs REST stateless)
                .csrf(csrf -> csrf.disable())
                
                // Configuración de autorización por ruta
                .authorizeHttpRequests(auth -> auth
                        
                        // Rutas públicas (sin autenticación)
                        .requestMatchers("/api/auth/**").permitAll() // Login y registro
                        .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll() // Ver productos
                        
                        // Rutas que requieren autenticación
                        .requestMatchers(HttpMethod.POST, "/api/productos").authenticated() // Crear producto
                        .requestMatchers(HttpMethod.PUT, "/api/productos/**").authenticated() // Actualizar producto
                        .requestMatchers(HttpMethod.DELETE, "/api/productos/**").authenticated() // Eliminar producto
                        .requestMatchers("/api/pedidos/**").authenticated() // Gestionar pedidos
                        
                        // Rutas que requieren rol específico
                        .requestMatchers("/api/admin/**").hasRole("ADMIN") // Solo administradores
                        
                        // Cualquier otra ruta requiere autenticación por defecto
                        .anyRequest().authenticated());

        return http.build();
    }
}
