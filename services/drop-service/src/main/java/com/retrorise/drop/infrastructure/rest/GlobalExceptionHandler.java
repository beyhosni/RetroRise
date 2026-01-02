package com.retrorise.drop.infrastructure.rest;

import com.retrorise.sharedkernel.exception.ApiError;
import com.retrorise.sharedkernel.exception.DomainException;
import com.retrorise.sharedkernel.exception.ResourceNotFoundException;
import com.retrorise.sharedkernel.observability.CorrelationIdUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Global exception handler for the Drop Service.
 * This component handles exceptions and returns standardized error responses.
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {

        log.error("Resource not found: {}", ex.getMessage());

        ApiError error = ApiError.builder()
                .type("https://api.retrorise.com/errors/resource-not-found")
                .title("Resource Not Found")
                .status(HttpStatus.NOT_FOUND.value())
                .detail(ex.getMessage())
                .instance(request.getDescription(false).replace("uri=", ""))
                .timestamp(LocalDateTime.now())
                .code(ex.getCode())
                .correlationId(CorrelationIdUtils.getOrGenerateCorrelationId())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(DomainException.class)
    public ResponseEntity<ApiError> handleDomainException(
            DomainException ex, WebRequest request) {

        log.error("Domain exception: {}", ex.getMessage());

        ApiError error = ApiError.builder()
                .type("https://api.retrorise.com/errors/domain-error")
                .title("Domain Error")
                .status(HttpStatus.BAD_REQUEST.value())
                .detail(ex.getMessage())
                .instance(request.getDescription(false).replace("uri=", ""))
                .timestamp(LocalDateTime.now())
                .code(ex.getCode())
                .correlationId(CorrelationIdUtils.getOrGenerateCorrelationId())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException ex, WebRequest request) {

        log.error("Validation error: {}", ex.getMessage());

        List<ApiError.ValidationError> validationErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fieldError -> ApiError.ValidationError.builder()
                        .field(fieldError.getField())
                        .message(fieldError.getDefaultMessage())
                        .rejectedValue(fieldError.getRejectedValue())
                        .build())
                .collect(Collectors.toList());

        ApiError error = ApiError.builder()
                .type("https://api.retrorise.com/errors/validation-error")
                .title("Validation Error")
                .status(HttpStatus.BAD_REQUEST.value())
                .detail("Validation failed for one or more fields")
                .instance(request.getDescription(false).replace("uri=", ""))
                .timestamp(LocalDateTime.now())
                .code("VALIDATION_ERROR")
                .errors(validationErrors)
                .correlationId(CorrelationIdUtils.getOrGenerateCorrelationId())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDeniedException(
            AccessDeniedException ex, WebRequest request) {

        log.error("Access denied: {}", ex.getMessage());

        ApiError error = ApiError.builder()
                .type("https://api.retrorise.com/errors/access-denied")
                .title("Access Denied")
                .status(HttpStatus.FORBIDDEN.value())
                .detail(ex.getMessage())
                .instance(request.getDescription(false).replace("uri=", ""))
                .timestamp(LocalDateTime.now())
                .code("ACCESS_DENIED")
                .correlationId(CorrelationIdUtils.getOrGenerateCorrelationId())
                .build();

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(
            Exception ex, WebRequest request) {

        log.error("Unexpected error: {}", ex.getMessage(), ex);

        ApiError error = ApiError.builder()
                .type("https://api.retrorise.com/errors/internal-server-error")
                .title("Internal Server Error")
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .detail("An unexpected error occurred")
                .instance(request.getDescription(false).replace("uri=", ""))
                .timestamp(LocalDateTime.now())
                .code("INTERNAL_SERVER_ERROR")
                .correlationId(CorrelationIdUtils.getOrGenerateCorrelationId())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
