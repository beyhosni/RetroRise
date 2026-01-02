package com.retrorise.sharedkernel.observability;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter that manages correlation IDs for HTTP requests.
 * It extracts correlation IDs from incoming requests and adds them to responses.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorrelationIdFilter extends OncePerRequestFilter {

    private static final String CORRELATION_ID_HEADER = "X-Correlation-ID";

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) 
            throws ServletException, IOException {

        // Extract correlation ID from request header or generate a new one
        String correlationId = request.getHeader(CORRELATION_ID_HEADER);
        if (correlationId == null || correlationId.isEmpty()) {
            correlationId = CorrelationIdUtils.generateCorrelationId();
        }

        // Set correlation ID in MDC for logging
        MDC.put("correlationId", correlationId);

        try {
            // Add correlation ID to response header
            response.setHeader(CORRELATION_ID_HEADER, correlationId);

            // Continue with the filter chain
            filterChain.doFilter(request, response);
        } finally {
            // Clean up MDC to avoid memory leaks
            MDC.remove("correlationId");
        }
    }
}
