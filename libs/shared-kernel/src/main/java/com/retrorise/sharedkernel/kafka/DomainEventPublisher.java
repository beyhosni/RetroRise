package com.retrorise.sharedkernel.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.retrorise.sharedkernel.domain.event.DomainEvent;
import com.retrorise.sharedkernel.observability.CorrelationIdUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

/**
 * Generic publisher for domain events to Kafka.
 * This component handles serialization of events and ensures correlation IDs are propagated.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DomainEventPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    /**
     * Publishes a domain event to the specified topic.
     *
     * @param topic The topic to publish to
     * @param event The domain event to publish
     * @param <T> The type of domain event
     */
    public <T extends DomainEvent> void publish(String topic, T event) {
        try {
            // Ensure correlation ID is set
            if (event.getCorrelationId() == null || event.getCorrelationId().isEmpty()) {
                event.setCorrelationId(CorrelationIdUtils.getOrGenerateCorrelationId());
            }

            // Serialize event to JSON
            String payload = objectMapper.writeValueAsString(event);

            // Send to Kafka with aggregate ID as key for partitioning
            CompletableFuture<SendResult<String, String>> future = 
                kafkaTemplate.send(topic, event.getAggregateId(), payload);

            // Handle result asynchronously
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("Event published successfully to topic: {}, partition: {}, offset: {}, eventId: {}", 
                            topic, result.getRecordMetadata().partition(), 
                            result.getRecordMetadata().offset(), event.getEventId());
                } else {
                    log.error("Failed to publish event to topic: {}, eventId: {}", topic, event.getEventId(), ex);
                }
            });
        } catch (Exception e) {
            log.error("Error publishing event to topic: {}, eventId: {}", topic, event.getEventId(), e);
            throw new RuntimeException("Failed to publish event", e);
        }
    }
}
