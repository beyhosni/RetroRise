package com.retrorise.gateway.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

/**
 * Validator for checking if a route requires authentication.
 */
@Component
public class RouteValidator {

    // List of endpoints that are open (no authentication required)
    public static final List<String> openApiEndpoints = List.of(
            "/api/v1/brands/public/**",
            "/api/v1/drops/public/**",
            "/api/v1/notifications/subscribe",
            "/auth/**",
            "/actuator/**",
            "/swagger-ui/**",
            "/v3/api-docs/**"
    );

    // Predicate to check if a route is secured (requires authentication)
    public Predicate<ServerHttpRequest> isSecured = 
        request -> openApiEndpoints.stream()
                .noneMatch(uri -> request.getURI().getPath().contains(uri));
}
