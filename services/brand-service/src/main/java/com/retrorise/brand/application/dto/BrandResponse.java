package com.retrorise.brand.application.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for brand response.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BrandResponse {

    private String id;
    private String name;
    private String description;
    private String logoUrl;
    private String industry;
    private Integer foundingYear;
    private String countryOfOrigin;
    private String websiteUrl;
    private Boolean isActive;
    private Integer acquisitionScore;
    private Integer marketPotentialScore;
    private Integer revivalComplexityScore;
    private Integer overallScore;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime updatedAt;

    private String createdBy;
    private String updatedBy;
}
