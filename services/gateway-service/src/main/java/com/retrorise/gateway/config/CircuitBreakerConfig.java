package com.retrorise.gateway.config;

import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.timelimiter.TimeLimiterConfig;
import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4JCircuitBreakerFactory;
import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4JConfigBuilder;
import org.springframework.cloud.client.circuitbreaker.Customizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * Configuration for circuit breakers in the Gateway Service.
 */
@Configuration
public class CircuitBreakerConfig {

    /**
     * Custom configuration for the brand service circuit breaker.
     */
    @Bean
    public Customizer<Resilience4JCircuitBreakerFactory> brandServiceCustomizer() {
        return factory -> factory.configure(
                builder -> builder
                        .circuitBreakerConfig(CircuitBreakerConfig.custom()
                                .failureRateThreshold(50)
                                .waitDurationInOpenState(Duration.ofSeconds(10))
                                .permittedNumberOfCallsInHalfOpenState(5)
                                .slidingWindowSize(10)
                                .slidingWindowType(CircuitBreakerConfig.SlidingWindowType.COUNT_BASED)
                                .build())
                        .timeLimiterConfig(TimeLimiterConfig.custom()
                                .timeoutDuration(Duration.ofSeconds(5))
                                .build()),
                "brandServiceCircuitBreaker");
    }

    /**
     * Custom configuration for the drop service circuit breaker.
     */
    @Bean
    public Customizer<Resilience4JCircuitBreakerFactory> dropServiceCustomizer() {
        return factory -> factory.configure(
                builder -> builder
                        .circuitBreakerConfig(CircuitBreakerConfig.custom()
                                .failureRateThreshold(50)
                                .waitDurationInOpenState(Duration.ofSeconds(10))
                                .permittedNumberOfCallsInHalfOpenState(5)
                                .slidingWindowSize(10)
                                .slidingWindowType(CircuitBreakerConfig.SlidingWindowType.COUNT_BASED)
                                .build())
                        .timeLimiterConfig(TimeLimiterConfig.custom()
                                .timeoutDuration(Duration.ofSeconds(5))
                                .build()),
                "dropServiceCircuitBreaker");
    }

    /**
     * Custom configuration for the order service circuit breaker.
     */
    @Bean
    public Customizer<Resilience4JCircuitBreakerFactory> orderServiceCustomizer() {
        return factory -> factory.configure(
                builder -> builder
                        .circuitBreakerConfig(CircuitBreakerConfig.custom()
                                .failureRateThreshold(50)
                                .waitDurationInOpenState(Duration.ofSeconds(10))
                                .permittedNumberOfCallsInHalfOpenState(5)
                                .slidingWindowSize(10)
                                .slidingWindowType(CircuitBreakerConfig.SlidingWindowType.COUNT_BASED)
                                .build())
                        .timeLimiterConfig(TimeLimiterConfig.custom()
                                .timeoutDuration(Duration.ofSeconds(5))
                                .build()),
                "orderServiceCircuitBreaker");
    }

    /**
     * Custom configuration for the notification service circuit breaker.
     */
    @Bean
    public Customizer<Resilience4JCircuitBreakerFactory> notificationServiceCustomizer() {
        return factory -> factory.configure(
                builder -> builder
                        .circuitBreakerConfig(CircuitBreakerConfig.custom()
                                .failureRateThreshold(50)
                                .waitDurationInOpenState(Duration.ofSeconds(10))
                                .permittedNumberOfCallsInHalfOpenState(5)
                                .slidingWindowSize(10)
                                .slidingWindowType(CircuitBreakerConfig.SlidingWindowType.COUNT_BASED)
                                .build())
                        .timeLimiterConfig(TimeLimiterConfig.custom()
                                .timeoutDuration(Duration.ofSeconds(5))
                                .build()),
                "notificationServiceCircuitBreaker");
    }
}
