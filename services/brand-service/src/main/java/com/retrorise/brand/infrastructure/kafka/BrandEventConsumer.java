package com.retrorise.brand.infrastructure.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
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
 * Kafka event consumer for the Brand Service.
 * This component listens for events from other services and processes them accordingly.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class BrandEventConsumer {

    private final ObjectMapper objectMapper;

    /**
     * Listens for drop-related events that might affect brands.
     * For example, when a drop is published for a brand, we might want to update brand metrics.
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
                    case "DropStockUpdated":
                        handleDropStockUpdatedEvent(event);
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
     * This could trigger updates to brand metrics or statistics.
     *
     * @param event The domain event
     */
    private void handleDropPublishedEvent(DomainEvent event) {
        log.debug("Processing DropPublished event for brand: {}", event.getAggregateId());
        // In a real implementation, this might update brand metrics, 
        // trigger notifications, or perform other business logic.
    }

    /**
     * Handles a DropStockUpdated event.
     * This could trigger updates to brand metrics or statistics.
     *
     * @param event The domain event
     */
    private void handleDropStockUpdatedEvent(DomainEvent event) {
        log.debug("Processing DropStockUpdated event for brand: {}", event.getAggregateId());
        // In a real implementation, this might update brand metrics, 
        // trigger notifications, or perform other business logic.
    }
}
