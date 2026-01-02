package com.retrorise.sharedkernel.domain.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Base class for all domain events in the RetroRise platform.
 * Domain events represent something that happened in the domain that domain experts care about.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public abstract class DomainEvent {

    /**
     * Unique identifier for this event instance
     */
    @Builder.Default
    private String eventId = UUID.randomUUID().toString();

    /**
     * Timestamp when the event occurred
     */
    @Builder.Default
    private LocalDateTime eventDate = LocalDateTime.now();

    /**
     * The aggregate ID that this event relates to
     */
    private String aggregateId;

    /**
     * The type of aggregate that this event relates to
     */
    private String aggregateType;

    /**
     * The type of event (e.g., "BrandCreated", "DropPublished")
     */
    private String eventType;

    /**
     * Version of the event schema
     */
    private String version;

    /**
     * Correlation ID for tracking related events across services
     */
    private String correlationId;
}
