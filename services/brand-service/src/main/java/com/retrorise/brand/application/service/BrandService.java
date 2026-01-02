package com.retrorise.brand.application.service;

import com.retrorise.brand.application.dto.BrandResponse;
import com.retrorise.brand.application.dto.CreateBrandRequest;
import com.retrorise.brand.application.dto.UpdateBrandRequest;
import com.retrorise.brand.application.mapper.BrandMapper;
import com.retrorise.brand.domain.model.Brand;
import com.retrorise.brand.domain.repository.BrandRepository;
import com.retrorise.sharedkernel.domain.event.BrandCreatedEvent;
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

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing brands.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepository;
    private final BrandMapper brandMapper;
    private final DomainEventPublisher eventPublisher;

    @Value("${kafka.topics.brand-events}")
    private String brandEventsTopic;

    /**
     * Creates a new brand.
     *
     * @param request The create brand request
     * @return The created brand
     */
    @Transactional
    public BrandResponse createBrand(CreateBrandRequest request) {
        log.info("Creating new brand with name: {}", request.getName());

        // Check if brand with same name already exists
        if (brandRepository.findByName(request.getName()).isPresent()) {
            throw new DomainException("BRAND_EXISTS", 
                String.format("Brand with name '%s' already exists", request.getName()));
        }

        // Create brand entity
        Brand brand = brandMapper.toEntity(request);
        brand.setCreatedBy(getCurrentUser());

        // Calculate overall score if all component scores are provided
        if (brand.getAcquisitionScore() != null && 
            brand.getMarketPotentialScore() != null && 
            brand.getRevivalComplexityScore() != null) {
            brand.calculateOverallScore();
        }

        // Save brand
        Brand savedBrand = brandRepository.save(brand);
        log.info("Brand created with ID: {}", savedBrand.getId());

        // Publish BrandCreated event
        publishBrandCreatedEvent(savedBrand);

        return brandMapper.toResponse(savedBrand);
    }

    /**
     * Gets a brand by ID.
     *
     * @param id The brand ID
     * @return The brand
     */
    public BrandResponse getBrandById(String id) {
        log.debug("Fetching brand with ID: {}", id);

        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", id));

        return brandMapper.toResponse(brand);
    }

    /**
     * Gets all brands with pagination.
     *
     * @param pageable Pagination parameters
     * @return Page of brands
     */
    public Page<BrandResponse> getAllBrands(Pageable pageable) {
        log.debug("Fetching all brands with pagination");

        return brandRepository.findAll(pageable)
                .map(brandMapper::toResponse);
    }

    /**
     * Gets all active brands.
     *
     * @return List of active brands
     */
    public List<BrandResponse> getActiveBrands() {
        log.debug("Fetching all active brands");

        return brandRepository.findByIsActiveTrue().stream()
                .map(brandMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Gets active brands with pagination.
     *
     * @param pageable Pagination parameters
     * @return Page of active brands
     */
    public Page<BrandResponse> getActiveBrands(Pageable pageable) {
        log.debug("Fetching active brands with pagination");

        return brandRepository.findByIsActiveTrue(pageable)
                .map(brandMapper::toResponse);
    }

    /**
     * Updates a brand.
     *
     * @param id The brand ID
     * @param request The update brand request
     * @return The updated brand
     */
    @Transactional
    public BrandResponse updateBrand(String id, UpdateBrandRequest request) {
        log.info("Updating brand with ID: {}", id);

        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", id));

        // Update brand fields
        brandMapper.updateEntityFromRequest(brand, request);
        brand.setUpdatedBy(getCurrentUser());

        // Recalculate overall score if scores were updated
        if (request.getAcquisitionScore() != null || 
            request.getMarketPotentialScore() != null || 
            request.getRevivalComplexityScore() != null) {
            brand.calculateOverallScore();
        }

        // Save updated brand
        Brand updatedBrand = brandRepository.save(brand);
        log.info("Brand updated with ID: {}", updatedBrand.getId());

        return brandMapper.toResponse(updatedBrand);
    }

    /**
     * Deletes a brand.
     *
     * @param id The brand ID
     */
    @Transactional
    public void deleteBrand(String id) {
        log.info("Deleting brand with ID: {}", id);

        if (!brandRepository.existsById(id)) {
            throw new ResourceNotFoundException("Brand", id);
        }

        brandRepository.deleteById(id);
        log.info("Brand deleted with ID: {}", id);
    }

    /**
     * Searches for brands by name or description.
     *
     * @param searchTerm The search term
     * @param pageable Pagination parameters
     * @return Page of matching brands
     */
    public Page<BrandResponse> searchBrands(String searchTerm, Pageable pageable) {
        log.debug("Searching brands with term: {}", searchTerm);

        return brandRepository.searchActiveBrands(searchTerm, pageable)
                .map(brandMapper::toResponse);
    }

    /**
     * Gets brands by industry.
     *
     * @param industry The industry
     * @return List of brands in the industry
     */
    public List<BrandResponse> getBrandsByIndustry(String industry) {
        log.debug("Fetching brands by industry: {}", industry);

        return brandRepository.findByIndustry(industry).stream()
                .map(brandMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Gets brands by overall score.
     *
     * @param minScore The minimum score
     * @return List of brands with score >= minScore
     */
    public List<BrandResponse> getBrandsByMinScore(Integer minScore) {
        log.debug("Fetching brands with minimum score: {}", minScore);

        return brandRepository.findByOverallScoreGreaterThanEqual(minScore).stream()
                .map(brandMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Publishes a BrandCreated event to Kafka.
     *
     * @param brand The brand that was created
     */
    private void publishBrandCreatedEvent(Brand brand) {
        BrandCreatedEvent event = BrandCreatedEvent.builder()
                .aggregateId(brand.getId())
                .aggregateType("Brand")
                .eventType("BrandCreated")
                .version("v1")
                .brandId(brand.getId())
                .name(brand.getName())
                .description(brand.getDescription())
                .logoUrl(brand.getLogoUrl())
                .industry(brand.getIndustry())
                .createdBy(brand.getCreatedBy())
                .build();

        eventPublisher.publish(brandEventsTopic, event);
        log.debug("Published BrandCreated event for brand ID: {}", brand.getId());
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
