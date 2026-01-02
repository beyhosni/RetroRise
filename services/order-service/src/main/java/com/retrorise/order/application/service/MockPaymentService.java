package com.retrorise.order.application.service;

import com.retrorise.order.application.dto.PaymentRequest;
import com.retrorise.order.application.dto.PaymentResponse;
import com.retrorise.order.application.dto.PaymentResponse.PaymentStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Mock payment service for testing and development.
 * This service simulates payment processing without connecting to real payment providers.
 */
@Service
@Slf4j
public class MockPaymentService {

    @Value("${payment.mock.enabled:true}")
    private boolean mockEnabled;

    @Value("${payment.mock.success-rate:0.9}")
    private double successRate;

    @Value("${payment.mock.processing-time-ms:1000}")
    private long processingTimeMs;

    /**
     * Processes a payment request.
     *
     * @param request The payment request
     * @return The payment response
     */
    public PaymentResponse processPayment(PaymentRequest request) {
        log.info("Processing mock payment for order: {}, amount: {} {}", 
                request.getOrderId(), request.getAmount(), request.getCurrency());

        // Simulate processing time
        try {
            Thread.sleep(processingTimeMs);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("Payment processing interrupted", e);
        }

        // Determine if payment should succeed based on success rate
        boolean success = Math.random() < successRate;

        String paymentId = UUID.randomUUID().toString();
        String transactionId = "TXN-" + UUID.randomUUID().toString();

        if (success) {
            log.info("Mock payment successful for order: {}, payment ID: {}", 
                    request.getOrderId(), paymentId);

            return PaymentResponse.builder()
                    .paymentId(paymentId)
                    .orderId(request.getOrderId())
                    .amount(request.getAmount())
                    .currency(request.getCurrency())
                    .paymentMethod(request.getPaymentMethod())
                    .status(PaymentStatus.COMPLETED)
                    .paymentDate(LocalDateTime.now())
                    .transactionId(transactionId)
                    .message("Payment processed successfully")
                    .build();
        } else {
            log.warn("Mock payment failed for order: {}, payment ID: {}", 
                    request.getOrderId(), paymentId);

            return PaymentResponse.builder()
                    .paymentId(paymentId)
                    .orderId(request.getOrderId())
                    .amount(request.getAmount())
                    .currency(request.getCurrency())
                    .paymentMethod(request.getPaymentMethod())
                    .status(PaymentStatus.FAILED)
                    .paymentDate(LocalDateTime.now())
                    .transactionId(transactionId)
                    .message("Payment failed: Insufficient funds")
                    .build();
        }
    }

    /**
     * Refunds a payment.
     *
     * @param paymentId The payment ID to refund
     * @return The payment response
     */
    public PaymentResponse refundPayment(String paymentId) {
        log.info("Processing mock refund for payment: {}", paymentId);

        // Simulate processing time
        try {
            Thread.sleep(processingTimeMs);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("Refund processing interrupted", e);
        }

        String transactionId = "REFUND-" + UUID.randomUUID().toString();

        log.info("Mock refund successful for payment: {}", paymentId);

        return PaymentResponse.builder()
                .paymentId(paymentId)
                .status(PaymentStatus.REFUNDED)
                .paymentDate(LocalDateTime.now())
                .transactionId(transactionId)
                .message("Refund processed successfully")
                .build();
    }

    /**
     * Checks if the mock payment service is enabled.
     *
     * @return true if enabled, false otherwise
     */
    public boolean isEnabled() {
        return mockEnabled;
    }
}
