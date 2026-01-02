package com.retrorise.sharedkernel.observability;

import org.slf4j.MDC;

import java.util.UUID;

/**
 * Utility class for managing correlation IDs across the application.
 * Correlation IDs are used to trace requests across multiple services.
 */
public class CorrelationIdUtils {

    private static final String CORRELATION_ID_KEY = "correlationId";

    /**
     * Gets the current correlation ID from MDC or generates a new one if not present.
     *
     * @return The current or new correlation ID
     */
    public static String getOrGenerateCorrelationId() {
        String correlationId = MDC.get(CORRELATION_ID_KEY);
        if (correlationId == null) {
            correlationId = generateCorrelationId();
            MDC.put(CORRELATION_ID_KEY, correlationId);
        }
        return correlationId;
    }

    /**
     * Generates a new correlation ID.
     *
     * @return A new correlation ID
     */
    public static String generateCorrelationId() {
        return UUID.randomUUID().toString();
    }

    /**
     * Sets the correlation ID in MDC.
     *
     * @param correlationId The correlation ID to set
     */
    public static void setCorrelationId(String correlationId) {
        MDC.put(CORRELATION_ID_KEY, correlationId);
    }

    /**
     * Clears the correlation ID from MDC.
     */
    public static void clearCorrelationId() {
        MDC.remove(CORRELATION_ID_KEY);
    }
}
