package com.retrorise.sharedkernel.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Standard API error response following RFC 7807 Problem Details for HTTP APIs.
 * This class provides a consistent error format across all services.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiError {

    /**
     * A URI reference that identifies the problem type.
     */
    private String type;

    /**
     * A short, human-readable summary of the problem type.
     */
    private String title;

    /**
     * The HTTP status code.
     */
    private int status;

    /**
     * A human-readable explanation specific to this occurrence of the problem.
     */
    private String detail;

    /**
     * A URI reference that identifies the specific occurrence of the problem.
     */
    private String instance;

    /**
     * Timestamp when the error occurred.
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime timestamp;

    /**
     * Additional error details for field validation errors.
     */
    private List<ValidationError> errors;

    /**
     * Additional application-specific error code.
     */
    private String code;

    /**
     * Correlation ID for tracking the error across services.
     */
    private String correlationId;

    /**
     * Validation error details for specific fields.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ValidationError {
        private String field;
        private String message;
        private Object rejectedValue;
    }
}
