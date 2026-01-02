package com.retrorise.sharedkernel.domain.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Event published when a new brand is created in the system.
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BrandCreatedEvent extends DomainEvent {

    private String brandId;
    private String name;
    private String description;
    private String logoUrl;
    private String industry;
    private String createdBy;
}
