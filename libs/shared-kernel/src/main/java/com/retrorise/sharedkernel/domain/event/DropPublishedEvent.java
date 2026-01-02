package com.retrorise.sharedkernel.domain.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Event published when a drop is published and becomes available for purchase.
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DropPublishedEvent extends DomainEvent {

    private String dropId;
    private String brandId;
    private String name;
    private String description;
    private String imageUrl;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer totalStock;
    private Integer maxItemsPerCustomer;
    private String createdBy;
}
