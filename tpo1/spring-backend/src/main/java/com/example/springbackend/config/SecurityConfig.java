package com.example.springbackend.config;

import java.lang.reflect.Array;
import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.CorsBeanDefinitionParser;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
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
                        // Public GET endpoints for React app
                        .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()
                        // Legacy/alt path if used
                        .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                        // Allow creation from frontend for now (no auth token configured yet)
                        .requestMatchers(HttpMethod.POST, "/products").permitAll()
                        .requestMatchers(HttpMethod.POST, "/categories").permitAll()
                        
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

    // esto va a permitir las configuraciones de CORS en toda la aplicacion de Spring
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Defino los origenes permitidos
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:2002"));
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
