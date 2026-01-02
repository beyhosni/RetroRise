package com.retrorise.drop.infrastructure.config;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Provider for the current auditor (user) for JPA auditing.
 */
@Component
public class AuditorProvider implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        // Try to get the current authenticated user
        if (SecurityContextHolder.getContext().getAuthentication() != null &&
            SecurityContextHolder.getContext().getAuthentication().isAuthenticated()) {
            return Optional.of(SecurityContextHolder.getContext().getAuthentication().getName());
        }

        // Fallback to system user
        return Optional.of("system");
    }
}
