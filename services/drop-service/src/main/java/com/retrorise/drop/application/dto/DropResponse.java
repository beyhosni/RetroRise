package com.retrorise.drop.application.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for drop response.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DropResponse {

    private String id;
    private String brandId;
    private String name;
    private String description;
    private String imageUrl;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime startDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime endDate;

    private Integer totalStock;
    private Integer availableStock;
    private Integer maxItemsPerCustomer;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime earlyAccessStartDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime earlyAccessEndDate;

    private String earlyAccessRoles;
    private Boolean isPublished;
    private Boolean isActive;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime updatedAt;

    private String createdBy;
    private String updatedBy;

    // Computed fields
    private Boolean currentlyActive;
    private Boolean earlyAccessActive;
    private Boolean hasStockAvailable;
}
