package com.retrorise.order.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for creating a new order.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    @NotBlank(message = "Customer ID is required")
    private String customerId;

    @NotBlank(message = "Customer email is required")
    @Email(message = "Invalid email format")
    private String customerEmail;

    @NotBlank(message = "Drop ID is required")
    private String dropId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotBlank(message = "Currency is required")
    @Size(min = 3, max = 3, message = "Currency must be a 3-letter code")
    private String currency;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    @Size(max = 500, message = "Shipping address must not exceed 500 characters")
    private String shippingAddress;

    @Size(max = 500, message = "Billing address must not exceed 500 characters")
    private String billingAddress;

    private List<OrderItemRequest> items;

    /**
     * DTO for order items.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemRequest {

        @NotBlank(message = "Product ID is required")
        private String productId;

        @NotBlank(message = "Product name is required")
        private String productName;

        @Size(max = 1000, message = "Product description must not exceed 1000 characters")
        private String productDescription;

        @Size(max = 500, message = "Product image URL must not exceed 500 characters")
        private String productImageUrl;

        @Size(max = 50, message = "Size must not exceed 50 characters")
        private String size;

        @Size(max = 50, message = "Color must not exceed 50 characters")
        private String color;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;
    }
}
