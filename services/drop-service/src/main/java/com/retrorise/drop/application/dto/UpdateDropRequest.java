package com.retrorise.drop.application.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for updating an existing drop.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDropRequest {

    @Size(max = 255, message = "Drop name must not exceed 255 characters")
    private String name;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    private String imageUrl;

    @Future(message = "Start date must be in the future")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime startDate;

    @Future(message = "End date must be in the future")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime endDate;

    @Min(value = 1, message = "Total stock must be at least 1")
    private Integer totalStock;

    @Min(value = 1, message = "Max items per customer must be at least 1")
    private Integer maxItemsPerCustomer;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime earlyAccessStartDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime earlyAccessEndDate;

    @Size(max = 500, message = "Early access roles must not exceed 500 characters")
    private String earlyAccessRoles;

    private Boolean isPublished;

    private Boolean isActive;
}
