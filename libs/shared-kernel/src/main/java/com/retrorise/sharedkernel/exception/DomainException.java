package com.retrorise.sharedkernel.exception;

/**
 * Base exception for domain-specific errors.
 * This exception should be used for business rule violations and domain logic errors.
 */
public class DomainException extends RuntimeException {

    private final String code;

    public DomainException(String message) {
        super(message);
        this.code = null;
    }

    public DomainException(String code, String message) {
        super(message);
        this.code = code;
    }

    public DomainException(String message, Throwable cause) {
        super(message, cause);
        this.code = null;
    }

    public DomainException(String code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
