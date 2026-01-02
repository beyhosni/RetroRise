package com.retrorise.sharedkernel.kafka;

import com.retrorise.sharedkernel.domain.event.DomainEvent;

/**
 * Interface for handling domain events.
 * Implementations of this interface will be automatically registered with the DomainEventConsumer.
 */
public interface DomainEventHandler {

    /**
     * Checks if this handler can process the given event.
     *
     * @param event The event to check
     * @return true if this handler can process the event, false otherwise
     */
    boolean canHandle(DomainEvent event);

    /**
     * Handles the domain event.
     *
     * @param event The event to handle
     */
    void handle(DomainEvent event);
}
