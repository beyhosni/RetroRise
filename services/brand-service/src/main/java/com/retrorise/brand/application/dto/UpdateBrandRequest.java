package com.retrorise.brand.application.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating an existing brand.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBrandRequest {

    @Size(max = 255, message = "Brand name must not exceed 255 characters")
    private String name;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @Size(max = 500, message = "Logo URL must not exceed 500 characters")
    private String logoUrl;

    @Size(max = 100, message = "Industry must not exceed 100 characters")
    private String industry;

    @Min(value = 1800, message = "Founding year must be after 1800")
    @Max(value = 2100, message = "Founding year must be before 2100")
    private Integer foundingYear;

    @Size(max = 100, message = "Country of origin must not exceed 100 characters")
    private String countryOfOrigin;

    @Size(max = 500, message = "Website URL must not exceed 500 characters")
    private String websiteUrl;

    private Boolean isActive;

    @Min(value = 1, message = "Acquisition score must be at least 1")
    @Max(value = 10, message = "Acquisition score must not exceed 10")
    private Integer acquisitionScore;

    @Min(value = 1, message = "Market potential score must be at least 1")
    @Max(value = 10, message = "Market potential score must not exceed 10")
    private Integer marketPotentialScore;

    @Min(value = 1, message = "Revival complexity score must be at least 1")
    @Max(value = 10, message = "Revival complexity score must not exceed 10")
    private Integer revivalComplexityScore;
}
