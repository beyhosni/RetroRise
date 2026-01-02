package com.retrorise.gateway.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

/**
 * Authentication filter for the API Gateway.
 * This filter validates JWT tokens and adds authentication headers to downstream services.
 */
@Component
@Slf4j
public class AuthenticationFilter extends AbstractGatewayFilterFactory<Object> {

    private final RouteValidator routeValidator;

    public AuthenticationFilter(RouteValidator routeValidator) {
        super(Object.class);
        this.routeValidator = routeValidator;
    }

    @Override
    public GatewayFilter apply(Object config) {
        return (exchange, chain) -> {
            // Check if the route is secured
            if (!routeValidator.isSecured.test(exchange.getRequest())) {
                return chain.filter(exchange);
            }

            // Check for Authorization header
            if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                log.warn("Authorization header is missing");
                exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            String authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                authHeader = authHeader.substring(7);
            }

            try {
                // Validate token (in a real implementation, this would validate the JWT)
                // For now, we just log it and pass it along
                log.debug("Processing authentication for request to {}", exchange.getRequest().getPath());

                // Add the authenticated user to the request headers for downstream services
                exchange.getRequest().mutate()
                        .header("X-User-Id", extractUserId(authHeader))
                        .header("X-User-Email", extractUserEmail(authHeader))
                        .header("X-User-Roles", extractUserRoles(authHeader))
                        .build();

                return chain.filter(exchange);
            } catch (Exception e) {
                log.error("Error processing authentication", e);
                exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
        };
    }

    /**
     * Extract user ID from the JWT token.
     * In a real implementation, this would decode and validate the JWT.
     */
    private String extractUserId(String token) {
        // In a real implementation, decode the JWT and extract the user ID
        // For now, return a placeholder
        return "user-id-from-token";
    }

    /**
     * Extract user email from the JWT token.
     * In a real implementation, this would decode and validate the JWT.
     */
    private String extractUserEmail(String token) {
        // In a real implementation, decode the JWT and extract the email
        // For now, return a placeholder
        return "user@example.com";
    }

    /**
     * Extract user roles from the JWT token.
     * In a real implementation, this would decode and validate the JWT.
     */
    private String extractUserRoles(String token) {
        // In a real implementation, decode the JWT and extract the roles
        // For now, return a placeholder
        return "ROLE_USER";
    }
}
