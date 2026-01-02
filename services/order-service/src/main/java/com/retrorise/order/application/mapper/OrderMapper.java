package com.retrorise.order.application.mapper;

import com.retrorise.order.application.dto.CreateOrderRequest;
import com.retrorise.order.application.dto.OrderResponse;
import com.retrorise.order.application.dto.UpdateOrderRequest;
import com.retrorise.order.application.dto.OrderResponse.OrderItemResponse;
import com.retrorise.order.domain.model.Order;
import com.retrorise.order.domain.model.OrderItem;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between Order entities and DTOs.
 */
@Component
public class OrderMapper {

    /**
     * Converts a CreateOrderRequest to an Order entity.
     *
     * @param request The create request
     * @return The Order entity
     */
    public Order toEntity(CreateOrderRequest request) {
        if (request == null) {
            return null;
        }

        return Order.builder()
                .customerId(request.getCustomerId())
                .customerEmail(request.getCustomerEmail())
                .dropId(request.getDropId())
                .quantity(request.getQuantity())
                .currency(request.getCurrency())
                .paymentMethod(request.getPaymentMethod())
                .shippingAddress(request.getShippingAddress())
                .billingAddress(request.getBillingAddress())
                .status(Order.OrderStatus.PENDING)
                .build();
    }

    /**
     * Updates an Order entity from an UpdateOrderRequest.
     *
     * @param order The order to update
     * @param request The update request
     */
    public void updateEntityFromRequest(Order order, UpdateOrderRequest request) {
        if (request == null || order == null) {
            return;
        }

        if (request.getShippingAddress() != null) {
            order.setShippingAddress(request.getShippingAddress());
        }
        if (request.getBillingAddress() != null) {
            order.setBillingAddress(request.getBillingAddress());
        }
        if (request.getTrackingNumber() != null) {
            order.setTrackingNumber(request.getTrackingNumber());
        }
        if (request.getCancellationReason() != null) {
            order.setCancellationReason(request.getCancellationReason());
        }
    }

    /**
     * Converts an Order entity to an OrderResponse DTO.
     *
     * @param order The order entity
     * @return The OrderResponse DTO
     */
    public OrderResponse toResponse(Order order) {
        if (order == null) {
            return null;
        }

        return OrderResponse.builder()
                .id(order.getId())
                .customerId(order.getCustomerId())
                .customerEmail(order.getCustomerEmail())
                .dropId(order.getDropId())
                .dropName(order.getDropName())
                .brandId(order.getBrandId())
                .brandName(order.getBrandName())
                .quantity(order.getQuantity())
                .unitPrice(order.getUnitPrice())
                .totalPrice(order.getTotalPrice())
                .currency(order.getCurrency())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .paymentId(order.getPaymentId())
                .paymentDate(order.getPaymentDate())
                .shippingAddress(order.getShippingAddress())
                .billingAddress(order.getBillingAddress())
                .trackingNumber(order.getTrackingNumber())
                .shippedDate(order.getShippedDate())
                .deliveredDate(order.getDeliveredDate())
                .cancelledDate(order.getCancelledDate())
                .cancellationReason(order.getCancellationReason())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .createdBy(order.getCreatedBy())
                .updatedBy(order.getUpdatedBy())
                .items(order.getItems().stream()
                        .map(this::toItemResponse)
                        .collect(java.util.stream.Collectors.toList()))
                .build();
    }

    /**
     * Converts an OrderItem entity to an OrderItemResponse DTO.
     *
     * @param item The order item entity
     * @return The OrderItemResponse DTO
     */
    private OrderItemResponse toItemResponse(OrderItem item) {
        if (item == null) {
            return null;
        }

        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .productName(item.getProductName())
                .productDescription(item.getProductDescription())
                .productImageUrl(item.getProductImageUrl())
                .size(item.getSize())
                .color(item.getColor())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .currency(item.getCurrency())
                .createdAt(item.getCreatedAt())
                .build();
    }
}
