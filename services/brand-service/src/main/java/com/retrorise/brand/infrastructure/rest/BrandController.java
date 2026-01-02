package com.retrorise.brand.infrastructure.rest;

import com.retrorise.brand.application.dto.BrandResponse;
import com.retrorise.brand.application.dto.CreateBrandRequest;
import com.retrorise.brand.application.dto.UpdateBrandRequest;
import com.retrorise.brand.application.service.BrandService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing brands.
 */
@RestController
@RequestMapping("/brands")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Brands", description = "API for managing brands in the RetroRise platform")
public class BrandController {

    private final BrandService brandService;

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS')")
    @Operation(summary = "Create a new brand", description = "Creates a new brand in the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Brand created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "409", description = "Brand with the same name already exists")
    })
    public ResponseEntity<BrandResponse> createBrand(
            @Valid @RequestBody CreateBrandRequest request) {

        log.info("REST request to create brand: {}", request.getName());
        BrandResponse result = brandService.createBrand(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get a brand by ID", description = "Retrieves a brand by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Brand found"),
        @ApiResponse(responseCode = "404", description = "Brand not found")
    })
    public ResponseEntity<BrandResponse> getBrandById(
            @Parameter(description = "Brand ID") @PathVariable String id) {

        log.debug("REST request to get brand by ID: {}", id);
        BrandResponse response = brandService.getBrandById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get all brands", description = "Retrieves all brands with pagination")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Brands retrieved successfully")
    })
    public ResponseEntity<Page<BrandResponse>> getAllBrands(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "name") String sort,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "asc") String direction) {

        log.debug("REST request to get all brands");
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        Page<BrandResponse> response = brandService.getAllBrands(pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/active", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get active brands", description = "Retrieves all active brands")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Active brands retrieved successfully")
    })
    public ResponseEntity<List<BrandResponse>> getActiveBrands() {
        log.debug("REST request to get active brands");
        List<BrandResponse> response = brandService.getActiveBrands();
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/active/paginated", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get active brands paginated", description = "Retrieves paginated list of active brands")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Active brands retrieved successfully")
    })
    public ResponseEntity<Page<BrandResponse>> getActiveBrandsPaginated(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "name") String sort,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "asc") String direction) {

        log.debug("REST request to get active brands paginated");
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        Page<BrandResponse> response = brandService.getActiveBrands(pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Search brands", description = "Searches for brands by name or description")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Search completed successfully")
    })
    public ResponseEntity<Page<BrandResponse>> searchBrands(
            @Parameter(description = "Search term") @RequestParam String searchTerm,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {

        log.debug("REST request to search brands with term: {}", searchTerm);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "name"));
        Page<BrandResponse> response = brandService.searchBrands(searchTerm, pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/industry/{industry}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get brands by industry", description = "Retrieves all brands in a specific industry")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Brands retrieved successfully")
    })
    public ResponseEntity<List<BrandResponse>> getBrandsByIndustry(
            @Parameter(description = "Industry") @PathVariable String industry) {

        log.debug("REST request to get brands by industry: {}", industry);
        List<BrandResponse> response = brandService.getBrandsByIndustry(industry);

        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/score/{minScore}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get brands by minimum score", description = "Retrieves brands with overall score >= minScore")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Brands retrieved successfully")
    })
    public ResponseEntity<List<BrandResponse>> getBrandsByMinScore(
            @Parameter(description = "Minimum score") @PathVariable Integer minScore) {

        log.debug("REST request to get brands with minimum score: {}", minScore);
        List<BrandResponse> response = brandService.getBrandsByMinScore(minScore);

        return ResponseEntity.ok(response);
    }

    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS')")
    @Operation(summary = "Update a brand", description = "Updates an existing brand")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Brand updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "404", description = "Brand not found")
    })
    public ResponseEntity<BrandResponse> updateBrand(
            @Parameter(description = "Brand ID") @PathVariable String id,
            @Valid @RequestBody UpdateBrandRequest request) {

        log.info("REST request to update brand: {}", id);
        BrandResponse result = brandService.updateBrand(id, request);

        return ResponseEntity.ok(result);
    }

    @DeleteMapping(value = "/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a brand", description = "Deletes a brand by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Brand deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Brand not found")
    })
    public ResponseEntity<Void> deleteBrand(
            @Parameter(description = "Brand ID") @PathVariable String id) {

        log.info("REST request to delete brand: {}", id);
        brandService.deleteBrand(id);

        return ResponseEntity.noContent().build();
    }
}
