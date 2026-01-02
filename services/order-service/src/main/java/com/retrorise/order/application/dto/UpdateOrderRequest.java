package com.retrorise.order.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating an existing order.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderRequest {

    @Size(max = 500, message = "Shipping address must not exceed 500 characters")
    private String shippingAddress;

    @Size(max = 500, message = "Billing address must not exceed 500 characters")
    private String billingAddress;

    @Size(max = 100, message = "Tracking number must not exceed 100 characters")
    private String trackingNumber;

    @Size(max = 500, message = "Cancellation reason must not exceed 500 characters")
    private String cancellationReason;
}
