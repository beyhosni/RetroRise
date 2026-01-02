package com.retrorise.sharedkernel.kafka;

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

import java.util.List;

/**
 * Generic consumer for domain events from Kafka.
 * This component handles deserialization of events and correlation ID propagation.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DomainEventConsumer {

    private final ObjectMapper objectMapper;
    private final List<DomainEventHandler> eventHandlers;

    /**
     * Generic listener for domain events.
     * This method deserializes the event and delegates to appropriate handlers.
     *
     * @param payload The JSON payload of the event
     * @param topic The topic the event was received from
     * @param partition The partition the event was received from
     * @param offset The offset of the event
     * @param eventType The type of the event
     */
    @KafkaListener(
        topics = "${kafka.topics.brand-events},${kafka.topics.drop-events},${kafka.topics.order-events}",
        groupId = "${spring.application.name}",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleEvent(
            @Payload String payload,
            @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset,
            @Header(value = "eventType", defaultValue = "") String eventType) {

        try {
            log.info("Received event from topic: {}, partition: {}, offset: {}, eventType: {}", 
                    topic, partition, offset, eventType);

            // Deserialize event
            DomainEvent event = objectMapper.readValue(payload, DomainEvent.class);

            // Set correlation ID in MDC for logging
            if (event.getCorrelationId() != null && !event.getCorrelationId().isEmpty()) {
                CorrelationIdUtils.setCorrelationId(event.getCorrelationId());
            }

            try {
                // Find and invoke appropriate handler
                for (DomainEventHandler handler : eventHandlers) {
                    if (handler.canHandle(event)) {
                        handler.handle(event);
                        log.info("Successfully handled event: {}, eventId: {}", eventType, event.getEventId());
                        break;
                    }
                }
            } finally {
                // Clean up MDC
                CorrelationIdUtils.clearCorrelationId();
            }
        } catch (Exception e) {
            log.error("Error processing event from topic: {}, partition: {}, offset: {}", 
                    topic, partition, offset, e);
            throw e; // Re-throw to trigger DLQ handling
        }
    }
}
