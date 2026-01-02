package com.retrorise.gateway.controller;

import com.retrorise.sharedkernel.exception.ApiError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

/**
 * Fallback controller for the Gateway Service.
 * This controller provides fallback responses when downstream services are unavailable.
 */
@RestController
public class FallbackController {

    @RequestMapping("/fallback")
    public ResponseEntity<ApiError> fallback() {
        ApiError error = ApiError.builder()
                .type("https://api.retrorise.com/errors/service-unavailable")
                .title("Service Unavailable")
                .status(HttpStatus.SERVICE_UNAVAILABLE.value())
                .detail("The requested service is temporarily unavailable. Please try again later.")
                .instance("/fallback")
                .timestamp(LocalDateTime.now())
                .code("SERVICE_UNAVAILABLE")
                .build();

        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
    }
}
