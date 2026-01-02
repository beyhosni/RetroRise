package com.retrorise.drop.application.mapper;

import com.retrorise.drop.application.dto.DropResponse;
import com.retrorise.drop.application.dto.CreateDropRequest;
import com.retrorise.drop.application.dto.UpdateDropRequest;
import com.retrorise.drop.domain.model.Drop;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between Drop entities and DTOs.
 */
@Component
public class DropMapper {

    /**
     * Converts a CreateDropRequest to a Drop entity.
     *
     * @param request The create request
     * @return The Drop entity
     */
    public Drop toEntity(CreateDropRequest request) {
        if (request == null) {
            return null;
        }

        return Drop.builder()
                .brandId(request.getBrandId())
                .name(request.getName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalStock(request.getTotalStock())
                .availableStock(request.getTotalStock()) // Initially, available stock equals total stock
                .maxItemsPerCustomer(request.getMaxItemsPerCustomer())
                .earlyAccessStartDate(request.getEarlyAccessStartDate())
                .earlyAccessEndDate(request.getEarlyAccessEndDate())
                .earlyAccessRoles(request.getEarlyAccessRoles())
                .isPublished(false)
                .isActive(true)
                .build();
    }

    /**
     * Updates a Drop entity from an UpdateDropRequest.
     *
     * @param drop The drop to update
     * @param request The update request
     */
    public void updateEntityFromRequest(Drop drop, UpdateDropRequest request) {
        if (request == null || drop == null) {
            return;
        }

        if (request.getName() != null) {
            drop.setName(request.getName());
        }
        if (request.getDescription() != null) {
            drop.setDescription(request.getDescription());
        }
        if (request.getImageUrl() != null) {
            drop.setImageUrl(request.getImageUrl());
        }
        if (request.getStartDate() != null) {
            drop.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            drop.setEndDate(request.getEndDate());
        }
        if (request.getTotalStock() != null) {
            drop.setTotalStock(request.getTotalStock());
        }
        if (request.getMaxItemsPerCustomer() != null) {
            drop.setMaxItemsPerCustomer(request.getMaxItemsPerCustomer());
        }
        if (request.getEarlyAccessStartDate() != null) {
            drop.setEarlyAccessStartDate(request.getEarlyAccessStartDate());
        }
        if (request.getEarlyAccessEndDate() != null) {
            drop.setEarlyAccessEndDate(request.getEarlyAccessEndDate());
        }
        if (request.getEarlyAccessRoles() != null) {
            drop.setEarlyAccessRoles(request.getEarlyAccessRoles());
        }
        if (request.getIsPublished() != null) {
            drop.setIsPublished(request.getIsPublished());
        }
        if (request.getIsActive() != null) {
            drop.setIsActive(request.getIsActive());
        }
    }

    /**
     * Converts a Drop entity to a DropResponse DTO.
     *
     * @param drop The drop entity
     * @return The DropResponse DTO
     */
    public DropResponse toResponse(Drop drop) {
        if (drop == null) {
            return null;
        }

        return DropResponse.builder()
                .id(drop.getId())
                .brandId(drop.getBrandId())
                .name(drop.getName())
                .description(drop.getDescription())
                .imageUrl(drop.getImageUrl())
                .startDate(drop.getStartDate())
                .endDate(drop.getEndDate())
                .totalStock(drop.getTotalStock())
                .availableStock(drop.getAvailableStock())
                .maxItemsPerCustomer(drop.getMaxItemsPerCustomer())
                .earlyAccessStartDate(drop.getEarlyAccessStartDate())
                .earlyAccessEndDate(drop.getEarlyAccessEndDate())
                .earlyAccessRoles(drop.getEarlyAccessRoles())
                .isPublished(drop.getIsPublished())
                .isActive(drop.getIsActive())
                .createdAt(drop.getCreatedAt())
                .updatedAt(drop.getUpdatedAt())
                .createdBy(drop.getCreatedBy())
                .updatedBy(drop.getUpdatedBy())
                .currentlyActive(drop.isCurrentlyActive())
                .earlyAccessActive(drop.isEarlyAccessActive())
                .hasStockAvailable(drop.hasStockAvailable())
                .build();
    }
}
