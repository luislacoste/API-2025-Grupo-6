package com.example.springbackend.config;

import java.util.Arrays;

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
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

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
    
    // JWT Filter to validate tokens
    private final JwtFilter jwtFilter;

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
                
                // Enable CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // Route authorization configuration
                .authorizeHttpRequests(auth -> auth
                        
                        // Public routes - Authentication endpoints
                        .requestMatchers("/api/auth/**").permitAll() 
                        
                        // Public routes - GET operations (anyone can view)
                        .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/orders/**").permitAll()
                        
                        // POST Products - Require authentication
                        .requestMatchers(HttpMethod.POST, "/products").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/products/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/products/**").hasRole("ADMIN")
                        
                        // Categories - Only ADMIN can modify
                        .requestMatchers(HttpMethod.POST, "/categories").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/categories/**").hasRole("ADMIN")
                        
                        // Orders - Require authentication
                        .requestMatchers(HttpMethod.POST, "/orders").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/orders/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/orders/**").hasAnyRole("ADMIN", "USER")
                        
                        // Admin specific routes
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        
                        // Any other route requires authentication by default
                        .anyRequest().authenticated())
                
                // Add JWT filter before UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // esto va a permitir las configuraciones de CORS en toda la aplicacion de Spring
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Defino los origenes permitidos
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://127.0.0.1:5173"));
        // Defino los metodos http permitidos
        configuration.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","OPTIONS"));
        // Defino los headers permitidos
        configuration.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization"));
        // Permito el envio de credenciales (cookies, headers de autorizacion, etc.)
        configuration.setAllowCredentials(true);

        // Defino que rutas aplican estas configuraciones /** todas
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
