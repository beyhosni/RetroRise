package com.retrorise.brand.application.mapper;

import com.retrorise.brand.application.dto.BrandResponse;
import com.retrorise.brand.application.dto.CreateBrandRequest;
import com.retrorise.brand.application.dto.UpdateBrandRequest;
import com.retrorise.brand.domain.model.Brand;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between Brand entities and DTOs.
 */
@Component
public class BrandMapper {

    /**
     * Converts a CreateBrandRequest to a Brand entity.
     *
     * @param request The create request
     * @return The Brand entity
     */
    public Brand toEntity(CreateBrandRequest request) {
        if (request == null) {
            return null;
        }

        return Brand.builder()
                .name(request.getName())
                .description(request.getDescription())
                .logoUrl(request.getLogoUrl())
                .industry(request.getIndustry())
                .foundingYear(request.getFoundingYear())
                .countryOfOrigin(request.getCountryOfOrigin())
                .websiteUrl(request.getWebsiteUrl())
                .acquisitionScore(request.getAcquisitionScore())
                .marketPotentialScore(request.getMarketPotentialScore())
                .revivalComplexityScore(request.getRevivalComplexityScore())
                .isActive(true)
                .build();
    }

    /**
     * Updates a Brand entity from an UpdateBrandRequest.
     *
     * @param brand The brand to update
     * @param request The update request
     */
    public void updateEntityFromRequest(Brand brand, UpdateBrandRequest request) {
        if (request == null || brand == null) {
            return;
        }

        if (request.getName() != null) {
            brand.setName(request.getName());
        }
        if (request.getDescription() != null) {
            brand.setDescription(request.getDescription());
        }
        if (request.getLogoUrl() != null) {
            brand.setLogoUrl(request.getLogoUrl());
        }
        if (request.getIndustry() != null) {
            brand.setIndustry(request.getIndustry());
        }
        if (request.getFoundingYear() != null) {
            brand.setFoundingYear(request.getFoundingYear());
        }
        if (request.getCountryOfOrigin() != null) {
            brand.setCountryOfOrigin(request.getCountryOfOrigin());
        }
        if (request.getWebsiteUrl() != null) {
            brand.setWebsiteUrl(request.getWebsiteUrl());
        }
        if (request.getIsActive() != null) {
            brand.setIsActive(request.getIsActive());
        }
        if (request.getAcquisitionScore() != null) {
            brand.setAcquisitionScore(request.getAcquisitionScore());
        }
        if (request.getMarketPotentialScore() != null) {
            brand.setMarketPotentialScore(request.getMarketPotentialScore());
        }
        if (request.getRevivalComplexityScore() != null) {
            brand.setRevivalComplexityScore(request.getRevivalComplexityScore());
        }
    }

    /**
     * Converts a Brand entity to a BrandResponse DTO.
     *
     * @param brand The brand entity
     * @return The BrandResponse DTO
     */
    public BrandResponse toResponse(Brand brand) {
        if (brand == null) {
            return null;
        }

        return BrandResponse.builder()
                .id(brand.getId())
                .name(brand.getName())
                .description(brand.getDescription())
                .logoUrl(brand.getLogoUrl())
                .industry(brand.getIndustry())
                .foundingYear(brand.getFoundingYear())
                .countryOfOrigin(brand.getCountryOfOrigin())
                .websiteUrl(brand.getWebsiteUrl())
                .isActive(brand.getIsActive())
                .acquisitionScore(brand.getAcquisitionScore())
                .marketPotentialScore(brand.getMarketPotentialScore())
                .revivalComplexityScore(brand.getRevivalComplexityScore())
                .overallScore(brand.getOverallScore())
                .createdAt(brand.getCreatedAt())
                .updatedAt(brand.getUpdatedAt())
                .createdBy(brand.getCreatedBy())
                .updatedBy(brand.getUpdatedBy())
                .build();
    }
}
