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
 * Kafka event consumer for drop events in the Notification Service.
 * This component listens for drop-related events and creates notifications accordingly.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class DropEventConsumer {

    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;

    /**
     * Listens for drop-related events and creates notifications.
     *
     * @param payload The JSON payload of the event
     * @param topic The topic the event was received from
     * @param partition The partition the event was received from
     * @param offset The offset of the event
     * @param eventType The type of the event
     */
    @KafkaListener(
        topics = "${kafka.topics.drop-events}",
        groupId = "${spring.application.name}",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleDropEvent(
            @Payload String payload,
            @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset,
            @Header(value = "eventType", defaultValue = "") String eventType) {

        try {
            log.info("Received drop event from topic: {}, partition: {}, offset: {}, eventType: {}", 
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
                    case "DropPublished":
                        handleDropPublishedEvent(event);
                        break;
                    case "DropEarlyAccessStarted":
                        handleDropEarlyAccessStartedEvent(event);
                        break;
                    case "DropLive":
                        handleDropLiveEvent(event);
                        break;
                    case "DropEndingSoon":
                        handleDropEndingSoonEvent(event);
                        break;
                    case "DropEnded":
                        handleDropEndedEvent(event);
                        break;
                    case "StockLow":
                        handleStockLowEvent(event);
                        break;
                    case "StockOut":
                        handleStockOutEvent(event);
                        break;
                    default:
                        log.debug("Unhandled drop event type: {}", eventType);
                }

                log.info("Successfully processed drop event: {}, eventId: {}", eventType, event.getEventId());
            } finally {
                // Clean up MDC
                CorrelationIdUtils.clearCorrelationId();
            }
        } catch (Exception e) {
            log.error("Error processing drop event from topic: {}, partition: {}, offset: {}", 
                    topic, partition, offset, e);
            throw e; // Re-throw to trigger DLQ handling
        }
    }

    /**
     * Handles a DropPublished event.
     * Creates a drop announcement notification for all subscribed users.
     *
     * @param event The domain event
     */
    private void handleDropPublishedEvent(DomainEvent event) {
        log.debug("Processing DropPublished event for drop: {}", event.getAggregateId());

        // Extract drop details from the event
        // In a real implementation, this would parse the event payload
        String dropId = event.getAggregateId();
        String dropName = "New Drop"; // Placeholder

        // Get all subscribed users (in a real implementation, this would query a subscription service)
        // For now, we'll just create a placeholder notification
        String customerEmail = "customer@example.com"; // Placeholder

        // Create notification
        NotificationRequest request = NotificationRequest.builder()
                .recipientEmail(customerEmail)
                .type(com.retrorise.notification.domain.model.Notification.NotificationType.DROP_ANNOUNCEMENT)
                .title("New Drop Announcement")
                .content("A new drop '" + dropName + "' has been announced!")
                .relatedEntityType("Drop")
                .relatedEntityId(dropId)
                .build();

        notificationService.createNotification(request);
    }

    /**
     * Handles a DropEarlyAccessStarted event.
     * Creates an early access notification for eligible users.
     *
     * @param event The domain event
     */
    private void handleDropEarlyAccessStartedEvent(DomainEvent event) {
        log.debug("Processing DropEarlyAccessStarted event for drop: {}", event.getAggregateId());

        // Extract drop details from the event
        String dropId = event.getAggregateId();
        String dropName = "New Drop"; // Placeholder

        // Get eligible users (in a real implementation, this would query a subscription service)
        String customerEmail = "customer@example.com"; // Placeholder

        // Create notification
        NotificationRequest request = NotificationRequest.builder()
                .recipientEmail(customerEmail)
                .type(com.retrorise.notification.domain.model.Notification.NotificationType.DROP_EARLY_ACCESS)
                .title("Early Access Started")
                .content("Early access for '" + dropName + "' has started!")
                .relatedEntityType("Drop")
                .relatedEntityId(dropId)
                .build();

        notificationService.createNotification(request);
    }

    /**
     * Handles a DropLive event.
     * Creates a drop live notification for all subscribed users.
     *
     * @param event The domain event
     */
    private void handleDropLiveEvent(DomainEvent event) {
        log.debug("Processing DropLive event for drop: {}", event.getAggregateId());

        // Extract drop details from the event
        String dropId = event.getAggregateId();
        String dropName = "New Drop"; // Placeholder

        // Get all subscribed users
        String customerEmail = "customer@example.com"; // Placeholder

        // Create notification
        NotificationRequest request = NotificationRequest.builder()
                .recipientEmail(customerEmail)
                .type(com.retrorise.notification.domain.model.Notification.NotificationType.DROP_LIVE)
                .title("Drop is Live!")
                .content("The drop '" + dropName + "' is now live!")
                .relatedEntityType("Drop")
                .relatedEntityId(dropId)
                .build();

        notificationService.createNotification(request);
    }

    /**
     * Handles a DropEndingSoon event.
     * Creates a drop ending soon notification for users who haven't purchased.
     *
     * @param event The domain event
     */
    private void handleDropEndingSoonEvent(DomainEvent event) {
        log.debug("Processing DropEndingSoon event for drop: {}", event.getAggregateId());

        // Extract drop details from the event
        String dropId = event.getAggregateId();
        String dropName = "New Drop"; // Placeholder

        // Get users who haven't purchased
        String customerEmail = "customer@example.com"; // Placeholder

        // Create notification
        NotificationRequest request = NotificationRequest.builder()
                .recipientEmail(customerEmail)
                .type(com.retrorise.notification.domain.model.Notification.NotificationType.DROP_ENDING_SOON)
                .title("Drop Ending Soon")
                .content("The drop '" + dropName + "' is ending soon!")
                .relatedEntityType("Drop")
                .relatedEntityId(dropId)
                .build();

        notificationService.createNotification(request);
    }

    /**
     * Handles a DropEnded event.
     * Creates a drop ended notification for all subscribed users.
     *
     * @param event The domain event
     */
    private void handleDropEndedEvent(DomainEvent event) {
        log.debug("Processing DropEnded event for drop: {}", event.getAggregateId());
        // Implementation similar to other drop events
    }

    /**
     * Handles a StockLow event.
     * Creates a stock low notification for users who haven't purchased.
     *
     * @param event The domain event
     */
    private void handleStockLowEvent(DomainEvent event) {
        log.debug("Processing StockLow event for drop: {}", event.getAggregateId());

        // Extract drop details from the event
        String dropId = event.getAggregateId();
        String dropName = "New Drop"; // Placeholder

        // Get users who haven't purchased
        String customerEmail = "customer@example.com"; // Placeholder

        // Create notification
        NotificationRequest request = NotificationRequest.builder()
                .recipientEmail(customerEmail)
                .type(com.retrorise.notification.domain.model.Notification.NotificationType.STOCK_ALERT)
                .title("Stock Running Low")
                .content("Stock for '" + dropName + "' is running low!")
                .relatedEntityType("Drop")
                .relatedEntityId(dropId)
                .build();

        notificationService.createNotification(request);
    }

    /**
     * Handles a StockOut event.
     * Creates a stock out notification for all subscribed users.
     *
     * @param event The domain event
     */
    private void handleStockOutEvent(DomainEvent event) {
        log.debug("Processing StockOut event for drop: {}", event.getAggregateId());

        // Extract drop details from the event
        String dropId = event.getAggregateId();
        String dropName = "New Drop"; // Placeholder

        // Get all subscribed users
        String customerEmail = "customer@example.com"; // Placeholder

        // Create notification
        NotificationRequest request = NotificationRequest.builder()
                .recipientEmail(customerEmail)
                .type(com.retrorise.notification.domain.model.Notification.NotificationType.STOCK_ALERT)
                .title("Sold Out!")
                .content("The drop '" + dropName + "' is now sold out!")
                .relatedEntityType("Drop")
                .relatedEntityId(dropId)
                .build();

        notificationService.createNotification(request);
    }
}
