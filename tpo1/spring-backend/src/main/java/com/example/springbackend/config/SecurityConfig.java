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
* Application security settings.
* Defines authentication, authorization, and permissions per route.
*/

@Configuration // Spring configuration class
@EnableWebSecurity // Enable Spring Security
@RequiredArgsConstructor // Dependency injection by constructor
public class SecurityConfig {

    // Repository to access users in the DB
    private final UsuarioRepository usuarioRepository;

    /**
    * Service that loads users from the database via email.
    * Used by Spring Security during login.
    */
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    /**
    * Spring Security authentication manager.
    * Required for custom login processes.
    */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
    * Password encoder using BCrypt.
    * BCrypt is secure, irreversible, and automatically includes salts.
    */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
    * Security filter chain configuration.
    * Defines which routes are public, which require authentication,
    * and which require specific roles.
    */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF (for stateless REST APIs)
                .csrf(csrf -> csrf.disable())
                
                // Route authorization configuration
                .authorizeHttpRequests(auth -> auth
                        
                        // Public routes (no authentication)
                        .requestMatchers("/api/auth/**").permitAll() 
                        .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                        
                        // Routes that require authentication
                        .requestMatchers(HttpMethod.POST, "/api/productos").authenticated() 
                        .requestMatchers(HttpMethod.PUT, "/api/productos/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/productos/**").authenticated()
                        .requestMatchers("/api/pedidos/**").authenticated()
                        
                        // Routes that require a specific role
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        
                        // Any other route requires authentication by default
                        .anyRequest().authenticated());

        return http.build();
    }
}
