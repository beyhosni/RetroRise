package com.retrorise.notification.infrastructure.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.retrorise.notification.application.dto.NotificationRequest;
import com.retrorise.notification.application.service.NotificationService;
import com.retrorise.sharedkernel.domain.event.DomainEvent;
import com.retrorise.sharedkernel.observability.CorrelationIdUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

/**
 * Kafka event consumer for the Notification Service.
 * This component listens for events from other services and creates notifications accordingly.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class NotificationEventConsumer {

    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;

    /**
     * Listens for order-related events and creates notifications.
     *
     * @param payload The JSON payload of the event
     * @param topic The topic the event was received from
     * @param partition The partition the event was received from
     * @param offset The offset of the event
     * @param eventType The type of the event
     */
    @KafkaListener(
        topics = "${kafka.topics.order-events}",
        groupId = "${spring.application.name}",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleOrderEvent(
            @Payload String payload,
            @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset,
            @Header(value = "eventType", defaultValue = "") String eventType) {

        try {
            log.info("Received order event from topic: {}, partition: {}, offset: {}, eventType: {}", 
                    topic, partition, offset, eventType);

            // Deserialize event
            DomainEvent event = objectMapper.readValue(payload, DomainEvent.class);

            // Set correlation ID in MDC for logging
            if (event.getCorrelationId() != null && !event.getCorrelationId().isEmpty()) {
                CorrelationIdUtils.setCorrelationId(event.getCorrelationId());
            }

            try {
                // Process the event based on its type
                switch (eventType) {
                    case "OrderPlaced":
                        handleOrderPlacedEvent(event);
                        break;
                    case "OrderPaid":
                        handleOrderPaidEvent(event);
                        break;
                    case "OrderShipped":
                        handleOrderShippedEvent(event);
                        break;
                    case "OrderDelivered":
                        handleOrderDeliveredEvent(event);
                        break;
                    case "OrderCancelled":
                        handleOrderCancelledEvent(event);
                        break;
                    case "OrderRefunded":
                        handleOrderRefundedEvent(event);
                        break;
                    default:
                        log.debug("Unhandled order event type: {}", eventType);
                }

                log.info("Successfully processed order event: {}, eventId: {}", eventType, event.getEventId());
            } finally {
                // Clean up MDC
                CorrelationIdUtils.clearCorrelationId();
            }
        } catch (Exception e) {
            log.error("Error processing order event from topic: {}, partition: {}, offset: {}", 
                    topic, partition, offset, e);
            throw e; // Re-throw to trigger DLQ handling
        }
    }

    /**
     * Handles an OrderPlaced event.
     * Creates an order confirmation notification.
     *
     * @param event The domain event
     */
    private void handleOrderPlacedEvent(DomainEvent event) {
        log.debug("Processing OrderPlaced event for order: {}", event.getAggregateId());

        // Extract order details from the event
        // In a real implementation, this would parse the event payload
        String customerEmail = "customer@example.com"; // Placeholder
        String orderId = event.getAggregateId();

        // Create notification
        NotificationRequest request = NotificationRequest.builder()
                .recipientEmail(customerEmail)
                .type(com.retrorise.notification.domain.model.Notification.NotificationType.ORDER_CONFIRMATION)
                .title("Order Confirmation")
                .content("Your order #" + orderId + " has been placed successfully!")
                .relatedEntityType("Order")
                .relatedEntityId(orderId)
                .build();

        notificationService.createNotification(request);
    }

    /**
     * Handles an OrderPaid event.
     * Creates a payment confirmation notification.
     *
     * @param event The domain event
     */
    private void handleOrderPaidEvent(DomainEvent event) {
        log.debug("Processing OrderPaid event for order: {}", event.getAggregateId());
        // Implementation similar to handleOrderPlacedEvent
    }

    /**
     * Handles an OrderShipped event.
     * Creates a shipping notification.
     *
     * @param event The domain event
     */
    private void handleOrderShippedEvent(DomainEvent event) {
        log.debug("Processing OrderShipped event for order: {}", event.getAggregateId());

        // Extract order details from the event
        String customerEmail = "customer@example.com"; // Placeholder
        String orderId = event.getAggregateId();

        // Create notification
        NotificationRequest request = NotificationRequest.builder()
                .recipientEmail(customerEmail)
                .type(com.retrorise.notification.domain.model.Notification.NotificationType.ORDER_SHIPPED)
                .title("Order Shipped")
                .content("Your order #" + orderId + " has been shipped!")
                .relatedEntityType("Order")
                .relatedEntityId(orderId)
                .build();

        notificationService.createNotification(request);
    }

    /**
     * Handles an OrderDelivered event.
     * Creates a delivery notification.
     *
     * @param event The domain event
     */
    private void handleOrderDeliveredEvent(DomainEvent event) {
        log.debug("Processing OrderDelivered event for order: {}", event.getAggregateId());

        // Extract order details from the event
        String customerEmail = "customer@example.com"; // Placeholder
        String orderId = event.getAggregateId();

        // Create notification
        NotificationRequest request = NotificationRequest.builder()
                .recipientEmail(customerEmail)
                .type(com.retrorise.notification.domain.model.Notification.NotificationType.ORDER_DELIVERED)
                .title("Order Delivered")
                .content("Your order #" + orderId + " has been delivered!")
                .relatedEntityType("Order")
                .relatedEntityId(orderId)
                .build();

        notificationService.createNotification(request);
    }

    /**
     * Handles an OrderCancelled event.
     * Creates a cancellation notification.
     *
     * @param event The domain event
     */
    private void handleOrderCancelledEvent(DomainEvent event) {
        log.debug("Processing OrderCancelled event for order: {}", event.getAggregateId());

        // Extract order details from the event
        String customerEmail = "customer@example.com"; // Placeholder
        String orderId = event.getAggregateId();

        // Create notification
        NotificationRequest request = NotificationRequest.builder()
                .recipientEmail(customerEmail)
                .type(com.retrorise.notification.domain.model.Notification.NotificationType.ORDER_CANCELLED)
                .title("Order Cancelled")
                .content("Your order #" + orderId + " has been cancelled.")
                .relatedEntityType("Order")
                .relatedEntityId(orderId)
                .build();

        notificationService.createNotification(request);
    }

    /**
     * Handles an OrderRefunded event.
     * Creates a refund notification.
     *
     * @param event The domain event
     */
    private void handleOrderRefundedEvent(DomainEvent event) {
        log.debug("Processing OrderRefunded event for order: {}", event.getAggregateId());

        // Extract order details from the event
        String customerEmail = "customer@example.com"; // Placeholder
        String orderId = event.getAggregateId();

        // Create notification
        NotificationRequest request = NotificationRequest.builder()
                .recipientEmail(customerEmail)
                .type(com.retrorise.notification.domain.model.Notification.NotificationType.ORDER_REFUNDED)
                .title("Order Refunded")
                .content("Your order #" + orderId + " has been refunded.")
                .relatedEntityType("Order")
                .relatedEntityId(orderId)
                .build();

        notificationService.createNotification(request);
    }
}
