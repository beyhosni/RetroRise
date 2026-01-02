package com.retrorise.notification.infrastructure.rest;

import com.retrorise.notification.application.dto.NotificationResponse;
import com.retrorise.notification.application.dto.NotificationRequest;
import com.retrorise.notification.application.service.NotificationService;
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
 * REST controller for managing notifications.
 */
@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Notifications", description = "API for managing notifications in the RetroRise platform")
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS')")
    @Operation(summary = "Create a new notification", description = "Creates a new notification in the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Notification created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "409", description = "Notification cannot be created")
    })
    public ResponseEntity<NotificationResponse> createNotification(
            @Valid @RequestBody NotificationRequest request) {

        log.info("REST request to create notification for recipient: {}", request.getRecipientEmail());
        NotificationResponse result = notificationService.createNotification(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get a notification by ID", description = "Retrieves a notification by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Notification found"),
        @ApiResponse(responseCode = "404", description = "Notification not found")
    })
    public ResponseEntity<NotificationResponse> getNotificationById(
            @Parameter(description = "Notification ID") @PathVariable String id) {

        log.debug("REST request to get notification by ID: {}", id);
        NotificationResponse response = notificationService.getNotificationById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS')")
    @Operation(summary = "Get all notifications", description = "Retrieves all notifications with pagination")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Notifications retrieved successfully")
    })
    public ResponseEntity<Page<NotificationResponse>> getAllNotifications(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "createdAt") String sort,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String direction) {

        log.debug("REST request to get all notifications");
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        Page<NotificationResponse> response = notificationService.getAllNotifications(pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/recipient/{recipientId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get notifications by recipient", description = "Retrieves all notifications for a specific recipient")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Notifications retrieved successfully")
    })
    public ResponseEntity<List<NotificationResponse>> getNotificationsByRecipientId(
            @Parameter(description = "Recipient ID") @PathVariable String recipientId) {

        log.debug("REST request to get notifications by recipient ID: {}", recipientId);
        List<NotificationResponse> response = notificationService.getNotificationsByRecipientId(recipientId);
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/recipient/{recipientId}/paginated", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get notifications by recipient paginated", description = "Retrieves paginated list of notifications for a specific recipient")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Notifications retrieved successfully")
    })
    public ResponseEntity<Page<NotificationResponse>> getNotificationsByRecipientIdPaginated(
            @Parameter(description = "Recipient ID") @PathVariable String recipientId,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "createdAt") String sort,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String direction) {

        log.debug("REST request to get notifications by recipient ID: {} with pagination", recipientId);
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        Page<NotificationResponse> response = notificationService.getNotificationsByRecipientId(recipientId, pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/recipient/{recipientId}/unread-count", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get unread notification count for recipient", description = "Retrieves the count of unread notifications for a specific recipient")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Unread count retrieved successfully")
    })
    public ResponseEntity<Long> getUnreadCount(
            @Parameter(description = "Recipient ID") @PathVariable String recipientId) {

        log.debug("REST request to get unread notification count for recipient ID: {}", recipientId);
        long count = notificationService.getUnreadCount(recipientId);
        return ResponseEntity.ok(count);
    }

    @PostMapping(value = "/{id}/read", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Mark notification as read", description = "Marks a notification as read")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Notification marked as read successfully"),
        @ApiResponse(responseCode = "404", description = "Notification not found")
    })
    public ResponseEntity<NotificationResponse> markAsRead(
            @Parameter(description = "Notification ID") @PathVariable String id) {

        log.info("REST request to mark notification as read: {}", id);
        NotificationResponse result = notificationService.markAsRead(id);
        return ResponseEntity.ok(result);
    }
}
