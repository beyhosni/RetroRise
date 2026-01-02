package com.retrorise.drop.infrastructure.kafka;

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
 * Kafka event consumer for the Drop Service.
 * This component listens for events from other services and processes them accordingly.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class DropEventConsumer {

    private final ObjectMapper objectMapper;

    /**
     * Listens for order-related events that might affect drops.
     * For example, when an order is placed, we might want to update drop stock.
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
                    case "OrderCancelled":
                        handleOrderCancelledEvent(event);
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
     * This should trigger a stock update for the drop.
     *
     * @param event The domain event
     */
    private void handleOrderPlacedEvent(DomainEvent event) {
        log.debug("Processing OrderPlaced event for drop: {}", event.getAggregateId());
        // In a real implementation, this would update the drop stock
        // by extracting the drop ID and quantity from the event payload
    }

    /**
     * Handles an OrderCancelled event.
     * This should trigger a stock restoration for the drop.
     *
     * @param event The domain event
     */
    private void handleOrderCancelledEvent(DomainEvent event) {
        log.debug("Processing OrderCancelled event for drop: {}", event.getAggregateId());
        // In a real implementation, this would restore the drop stock
        // by extracting the drop ID and quantity from the event payload
    }
}
