package com.retrorise.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

/**
 * Security configuration for the Gateway Service.
 * This configures JWT-based authentication with Keycloak.
 */
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
            .authorizeExchange(exchanges -> exchanges
                .pathMatchers("/actuator/**").permitAll()
                .pathMatchers("/fallback").permitAll()
                .pathMatchers("/api/brands/**").hasAnyRole("ADMIN", "OPS", "CUSTOMER")
                .pathMatchers("/api/drops/**").hasAnyRole("ADMIN", "OPS", "CUSTOMER")
                .pathMatchers("/api/orders/**").hasAnyRole("ADMIN", "OPS", "CUSTOMER")
                .anyExchange().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .jwkSetUri("http://localhost:8180/realms/retro-rise/protocol/openid-connect/certs")
                )
            )
            .csrf(ServerHttpSecurity.CsrfSpec::disable);

        return http.build();
    }
}
