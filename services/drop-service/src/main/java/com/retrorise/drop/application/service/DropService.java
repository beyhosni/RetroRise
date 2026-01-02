package com.retrorise.drop.application.service;

import com.retrorise.drop.application.dto.DropResponse;
import com.retrorise.drop.application.dto.CreateDropRequest;
import com.retrorise.drop.application.dto.UpdateDropRequest;
import com.retrorise.drop.application.mapper.DropMapper;
import com.retrorise.drop.domain.model.Drop;
import com.retrorise.drop.domain.repository.DropRepository;
import com.retrorise.sharedkernel.domain.event.DropPublishedEvent;
import com.retrorise.sharedkernel.exception.DomainException;
import com.retrorise.sharedkernel.exception.ResourceNotFoundException;
import com.retrorise.sharedkernel.kafka.DomainEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing drops.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class DropService {

    private final DropRepository dropRepository;
    private final DropMapper dropMapper;
    private final DomainEventPublisher eventPublisher;

    @Value("${kafka.topics.drop-events}")
    private String dropEventsTopic;

    /**
     * Creates a new drop.
     *
     * @param request The create drop request
     * @return The created drop
     */
    @Transactional
    public DropResponse createDrop(CreateDropRequest request) {
        log.info("Creating new drop with name: {}", request.getName());

        // Validate dates
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new DomainException("INVALID_DATES", "End date must be after start date");
        }

        // Validate early access dates if provided
        if (request.getEarlyAccessStartDate() != null && request.getEarlyAccessEndDate() != null) {
            if (request.getEarlyAccessEndDate().isAfter(request.getStartDate())) {
                throw new DomainException("INVALID_EARLY_ACCESS_DATES", 
                    "Early access end date must be before start date");
            }

            if (request.getEarlyAccessEndDate().isBefore(request.getEarlyAccessStartDate())) {
                throw new DomainException("INVALID_EARLY_ACCESS_DATES", 
                    "Early access end date must be after early access start date");
            }
        }

        // Create drop entity
        Drop drop = dropMapper.toEntity(request);
        drop.setCreatedBy(getCurrentUser());

        // Save drop
        Drop savedDrop = dropRepository.save(drop);
        log.info("Drop created with ID: {}", savedDrop.getId());

        return dropMapper.toResponse(savedDrop);
    }

    /**
     * Gets a drop by ID.
     *
     * @param id The drop ID
     * @return The drop
     */
    public DropResponse getDropById(String id) {
        log.debug("Fetching drop with ID: {}", id);

        Drop drop = dropRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drop", id));

        return dropMapper.toResponse(drop);
    }

    /**
     * Gets all drops with pagination.
     *
     * @param pageable Pagination parameters
     * @return Page of drops
     */
    public Page<DropResponse> getAllDrops(Pageable pageable) {
        log.debug("Fetching all drops with pagination");

        return dropRepository.findAll(pageable)
                .map(dropMapper::toResponse);
    }

    /**
     * Gets all published drops.
     *
     * @return List of published drops
     */
    public List<DropResponse> getPublishedDrops() {
        log.debug("Fetching all published drops");

        return dropRepository.findByIsPublishedTrue().stream()
                .map(dropMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Gets published drops with pagination.
     *
     * @param pageable Pagination parameters
     * @return Page of published drops
     */
    public Page<DropResponse> getPublishedDrops(Pageable pageable) {
        log.debug("Fetching published drops with pagination");

        return dropRepository.findByIsPublishedTrue(pageable)
                .map(dropMapper::toResponse);
    }

    /**
     * Gets currently active drops.
     *
     * @return List of active drops
     */
    public List<DropResponse> getActiveDrops() {
        log.debug("Fetching active drops");

        return dropRepository.findActiveDrops(LocalDateTime.now()).stream()
                .map(dropMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Gets active drops with pagination.
     *
     * @param pageable Pagination parameters
     * @return Page of active drops
     */
    public Page<DropResponse> getActiveDrops(Pageable pageable) {
        log.debug("Fetching active drops with pagination");

        return dropRepository.findActiveDrops(LocalDateTime.now(), pageable)
                .map(dropMapper::toResponse);
    }

    /**
     * Updates a drop.
     *
     * @param id The drop ID
     * @param request The update drop request
     * @return The updated drop
     */
    @Transactional
    public DropResponse updateDrop(String id, UpdateDropRequest request) {
        log.info("Updating drop with ID: {}", id);

        Drop drop = dropRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drop", id));

        // Update drop fields
        dropMapper.updateEntityFromRequest(drop, request);
        drop.setUpdatedBy(getCurrentUser());

        // Validate dates if both are provided
        if (drop.getStartDate() != null && drop.getEndDate() != null) {
            if (drop.getEndDate().isBefore(drop.getStartDate())) {
                throw new DomainException("INVALID_DATES", "End date must be after start date");
            }
        }

        // Validate early access dates if both are provided
        if (drop.getEarlyAccessStartDate() != null && drop.getEarlyAccessEndDate() != null) {
            if (drop.getEarlyAccessEndDate().isAfter(drop.getStartDate())) {
                throw new DomainException("INVALID_EARLY_ACCESS_DATES", 
                    "Early access end date must be before start date");
            }

            if (drop.getEarlyAccessEndDate().isBefore(drop.getEarlyAccessStartDate())) {
                throw new DomainException("INVALID_EARLY_ACCESS_DATES", 
                    "Early access end date must be after early access start date");
            }
        }

        // Save updated drop
        Drop updatedDrop = dropRepository.save(drop);
        log.info("Drop updated with ID: {}", updatedDrop.getId());

        return dropMapper.toResponse(updatedDrop);
    }

    /**
     * Publishes a drop.
     *
     * @param id The drop ID
     * @return The published drop
     */
    @Transactional
    public DropResponse publishDrop(String id) {
        log.info("Publishing drop with ID: {}", id);

        Drop drop = dropRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drop", id));

        if (drop.getIsPublished()) {
            throw new DomainException("DROP_ALREADY_PUBLISHED", 
                String.format("Drop with ID '%s' is already published", id));
        }

        // Publish the drop
        drop.setIsPublished(true);
        drop.setUpdatedBy(getCurrentUser());

        // Save updated drop
        Drop publishedDrop = dropRepository.save(drop);
        log.info("Drop published with ID: {}", publishedDrop.getId());

        // Publish DropPublished event
        publishDropPublishedEvent(publishedDrop);

        return dropMapper.toResponse(publishedDrop);
    }

    /**
     * Deletes a drop.
     *
     * @param id The drop ID
     */
    @Transactional
    public void deleteDrop(String id) {
        log.info("Deleting drop with ID: {}", id);

        if (!dropRepository.existsById(id)) {
            throw new ResourceNotFoundException("Drop", id);
        }

        dropRepository.deleteById(id);
        log.info("Drop deleted with ID: {}", id);
    }

    /**
     * Searches for drops by name or description.
     *
     * @param searchTerm The search term
     * @param pageable Pagination parameters
     * @return Page of matching drops
     */
    public Page<DropResponse> searchDrops(String searchTerm, Pageable pageable) {
        log.debug("Searching drops with term: {}", searchTerm);

        return dropRepository.searchActiveDrops(searchTerm, pageable)
                .map(dropMapper::toResponse);
    }

    /**
     * Gets drops by brand ID.
     *
     * @param brandId The brand ID
     * @return List of drops for the brand
     */
    public List<DropResponse> getDropsByBrandId(String brandId) {
        log.debug("Fetching drops by brand ID: {}", brandId);

        return dropRepository.findByBrandId(brandId).stream()
                .map(dropMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Gets published drops by brand ID.
     *
     * @param brandId The brand ID
     * @return List of published drops for the brand
     */
    public List<DropResponse> getPublishedDropsByBrandId(String brandId) {
        log.debug("Fetching published drops by brand ID: {}", brandId);

        return dropRepository.findByBrandIdAndIsPublishedTrue(brandId).stream()
                .map(dropMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Gets drops with active early access.
     *
     * @return List of drops with active early access
     */
    public List<DropResponse> getDropsWithActiveEarlyAccess() {
        log.debug("Fetching drops with active early access");

        return dropRepository.findDropsWithActiveEarlyAccess(LocalDateTime.now()).stream()
                .map(dropMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Gets drops that will start within the specified time range.
     *
     * @param start Start of the time range
     * @param end End of the time range
     * @return List of drops starting in the time range
     */
    public List<DropResponse> getDropsStartingInRange(LocalDateTime start, LocalDateTime end) {
        log.debug("Fetching drops starting between {} and {}", start, end);

        return dropRepository.findDropsStartingInRange(start, end).stream()
                .map(dropMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Decrements the available stock of a drop.
     *
     * @param dropId The drop ID
     * @param quantity The quantity to decrement
     */
    @Transactional
    public void decrementStock(String dropId, int quantity) {
        log.debug("Decrementing stock for drop {} by {}", dropId, quantity);

        Drop drop = dropRepository.findById(dropId)
                .orElseThrow(() -> new ResourceNotFoundException("Drop", dropId));

        drop.decrementStock(quantity);

        dropRepository.save(drop);
    }

    /**
     * Publishes a DropPublished event to Kafka.
     *
     * @param drop The drop that was published
     */
    private void publishDropPublishedEvent(Drop drop) {
        DropPublishedEvent event = DropPublishedEvent.builder()
                .aggregateId(drop.getId())
                .aggregateType("Drop")
                .eventType("DropPublished")
                .version("v1")
                .dropId(drop.getId())
                .brandId(drop.getBrandId())
                .name(drop.getName())
                .description(drop.getDescription())
                .imageUrl(drop.getImageUrl())
                .startDate(drop.getStartDate())
                .endDate(drop.getEndDate())
                .totalStock(drop.getTotalStock())
                .maxItemsPerCustomer(drop.getMaxItemsPerCustomer())
                .createdBy(drop.getCreatedBy())
                .build();

        eventPublisher.publish(dropEventsTopic, event);
        log.debug("Published DropPublished event for drop ID: {}", drop.getId());
    }

    /**
     * Gets the current authenticated user.
     *
     * @return The username of the current user
     */
    private String getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return "system";
    }
}
