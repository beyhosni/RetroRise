package com.retrorise.order.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for payment request.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {

    @NotBlank(message = "Order ID is required")
    private String orderId;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    @NotBlank(message = "Currency is required")
    private String currency;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    /**
     * Credit card payment details (for card payments).
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CardDetails {

        @NotBlank(message = "Card number is required")
        @Pattern(regexp = "^[0-9]{16}$", message = "Card number must be 16 digits")
        private String cardNumber;

        @NotBlank(message = "Card holder name is required")
        private String cardHolderName;

        @NotBlank(message = "Expiry date is required")
        @Pattern(regexp = "^(0[1-9]|1[0-2])/[0-9]{2}$", message = "Expiry date must be in MM/YY format")
        private String expiryDate;

        @NotBlank(message = "CVV is required")
        @Pattern(regexp = "^[0-9]{3,4}$", message = "CVV must be 3 or 4 digits")
        private String cvv;
    }

    /**
     * PayPal payment details (for PayPal payments).
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PayPalDetails {

        @NotBlank(message = "PayPal email is required")
        private String email;

        @NotBlank(message = "PayPal password is required")
        private String password;
    }
}
