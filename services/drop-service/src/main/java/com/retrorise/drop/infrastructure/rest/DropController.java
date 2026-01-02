package com.retrorise.drop.infrastructure.rest;

import com.retrorise.drop.application.dto.DropResponse;
import com.retrorise.drop.application.dto.CreateDropRequest;
import com.retrorise.drop.application.dto.UpdateDropRequest;
import com.retrorise.drop.application.service.DropService;
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
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * REST controller for managing drops.
 */
@RestController
@RequestMapping("/drops")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Drops", description = "API for managing drops in the RetroRise platform")
public class DropController {

    private final DropService dropService;

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS')")
    @Operation(summary = "Create a new drop", description = "Creates a new drop in the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Drop created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "409", description = "Drop with the same name already exists")
    })
    public ResponseEntity<DropResponse> createDrop(
            @Valid @RequestBody CreateDropRequest request) {

        log.info("REST request to create drop: {}", request.getName());
        DropResponse result = dropService.createDrop(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get a drop by ID", description = "Retrieves a drop by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Drop found"),
        @ApiResponse(responseCode = "404", description = "Drop not found")
    })
    public ResponseEntity<DropResponse> getDropById(
            @Parameter(description = "Drop ID") @PathVariable String id) {

        log.debug("REST request to get drop by ID: {}", id);
        DropResponse response = dropService.getDropById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get all drops", description = "Retrieves all drops with pagination")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Drops retrieved successfully")
    })
    public ResponseEntity<Page<DropResponse>> getAllDrops(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "startDate") String sort,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "asc") String direction) {

        log.debug("REST request to get all drops");
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        Page<DropResponse> response = dropService.getAllDrops(pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/published", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get published drops", description = "Retrieves all published drops")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Published drops retrieved successfully")
    })
    public ResponseEntity<List<DropResponse>> getPublishedDrops() {
        log.debug("REST request to get published drops");
        List<DropResponse> response = dropService.getPublishedDrops();
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/published/paginated", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get published drops paginated", description = "Retrieves paginated list of published drops")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Published drops retrieved successfully")
    })
    public ResponseEntity<Page<DropResponse>> getPublishedDropsPaginated(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "startDate") String sort,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "asc") String direction) {

        log.debug("REST request to get published drops paginated");
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        Page<DropResponse> response = dropService.getPublishedDrops(pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/active", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get active drops", description = "Retrieves all currently active drops")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Active drops retrieved successfully")
    })
    public ResponseEntity<List<DropResponse>> getActiveDrops() {
        log.debug("REST request to get active drops");
        List<DropResponse> response = dropService.getActiveDrops();
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/active/paginated", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get active drops paginated", description = "Retrieves paginated list of active drops")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Active drops retrieved successfully")
    })
    public ResponseEntity<Page<DropResponse>> getActiveDropsPaginated(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "startDate") String sort,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "asc") String direction) {

        log.debug("REST request to get active drops paginated");
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        Page<DropResponse> response = dropService.getActiveDrops(pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Search drops", description = "Searches for drops by name or description")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Search completed successfully")
    })
    public ResponseEntity<Page<DropResponse>> searchDrops(
            @Parameter(description = "Search term") @RequestParam String searchTerm,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {

        log.debug("REST request to search drops with term: {}", searchTerm);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "name"));
        Page<DropResponse> response = dropService.searchDrops(searchTerm, pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/brand/{brandId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get drops by brand", description = "Retrieves all drops for a specific brand")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Drops retrieved successfully")
    })
    public ResponseEntity<List<DropResponse>> getDropsByBrandId(
            @Parameter(description = "Brand ID") @PathVariable String brandId) {

        log.debug("REST request to get drops by brand ID: {}", brandId);
        List<DropResponse> response = dropService.getDropsByBrandId(brandId);

        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/brand/{brandId}/published", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get published drops by brand", description = "Retrieves all published drops for a specific brand")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Published drops retrieved successfully")
    })
    public ResponseEntity<List<DropResponse>> getPublishedDropsByBrandId(
            @Parameter(description = "Brand ID") @PathVariable String brandId) {

        log.debug("REST request to get published drops by brand ID: {}", brandId);
        List<DropResponse> response = dropService.getPublishedDropsByBrandId(brandId);

        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/early-access/active", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get drops with active early access", description = "Retrieves all drops with active early access")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Drops with active early access retrieved successfully")
    })
    public ResponseEntity<List<DropResponse>> getDropsWithActiveEarlyAccess() {
        log.debug("REST request to get drops with active early access");
        List<DropResponse> response = dropService.getDropsWithActiveEarlyAccess();
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/starting-in-range", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get drops starting in range", description = "Retrieves all drops that will start within the specified time range")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Drops retrieved successfully")
    })
    public ResponseEntity<List<DropResponse>> getDropsStartingInRange(
            @Parameter(description = "Start of time range") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @Parameter(description = "End of time range") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        log.debug("REST request to get drops starting between {} and {}", start, end);
        List<DropResponse> response = dropService.getDropsStartingInRange(start, end);

        return ResponseEntity.ok(response);
    }

    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS')")
    @Operation(summary = "Update a drop", description = "Updates an existing drop")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Drop updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "404", description = "Drop not found")
    })
    public ResponseEntity<DropResponse> updateDrop(
            @Parameter(description = "Drop ID") @PathVariable String id,
            @Valid @RequestBody UpdateDropRequest request) {

        log.info("REST request to update drop: {}", id);
        DropResponse result = dropService.updateDrop(id, request);

        return ResponseEntity.ok(result);
    }

    @PostMapping(value = "/{id}/publish", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS')")
    @Operation(summary = "Publish a drop", description = "Publishes a drop to make it available to customers")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Drop published successfully"),
        @ApiResponse(responseCode = "404", description = "Drop not found"),
        @ApiResponse(responseCode = "409", description = "Drop is already published")
    })
    public ResponseEntity<DropResponse> publishDrop(
            @Parameter(description = "Drop ID") @PathVariable String id) {

        log.info("REST request to publish drop: {}", id);
        DropResponse result = dropService.publishDrop(id);

        return ResponseEntity.ok(result);
    }

    @DeleteMapping(value = "/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a drop", description = "Deletes a drop by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Drop deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Drop not found")
    })
    public ResponseEntity<Void> deleteDrop(
            @Parameter(description = "Drop ID") @PathVariable String id) {

        log.info("REST request to delete drop: {}", id);
        dropService.deleteDrop(id);

        return ResponseEntity.noContent().build();
    }
}
