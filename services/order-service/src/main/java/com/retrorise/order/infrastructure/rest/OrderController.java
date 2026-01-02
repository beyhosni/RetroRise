package com.retrorise.order.infrastructure.rest;

import com.retrorise.order.application.dto.OrderResponse;
import com.retrorise.order.application.dto.CreateOrderRequest;
import com.retrorise.order.application.dto.UpdateOrderRequest;
import com.retrorise.order.application.dto.PaymentRequest;
import com.retrorise.order.application.dto.PaymentResponse;
import com.retrorise.order.application.service.OrderService;
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
 * REST controller for managing orders.
 */
@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Orders", description = "API for managing orders in the RetroRise platform")
public class OrderController {

    private final OrderService orderService;

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Create a new order", description = "Creates a new order in the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Order created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "409", description = "Order cannot be created")
    })
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody CreateOrderRequest request) {

        log.info("REST request to create order for customer: {}", request.getCustomerId());
        OrderResponse result = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PostMapping(value = "/{id}/payment", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Process payment for an order", description = "Processes payment for an order")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payment processed successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data or order cannot be paid"),
        @ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<PaymentResponse> processPayment(
            @Parameter(description = "Order ID") @PathVariable String id,
            @Valid @RequestBody PaymentRequest request) {

        log.info("REST request to process payment for order: {}", id);
        request.setOrderId(id);
        PaymentResponse result = orderService.processPayment(request);
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get an order by ID", description = "Retrieves an order by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Order found"),
        @ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<OrderResponse> getOrderById(
            @Parameter(description = "Order ID") @PathVariable String id) {

        log.debug("REST request to get order by ID: {}", id);
        OrderResponse response = orderService.getOrderById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS')")
    @Operation(summary = "Get all orders", description = "Retrieves all orders with pagination")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Orders retrieved successfully")
    })
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "createdAt") String sort,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String direction) {

        log.debug("REST request to get all orders");
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        Page<OrderResponse> response = orderService.getAllOrders(pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/customer/{customerId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get orders by customer", description = "Retrieves all orders for a specific customer")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Orders retrieved successfully")
    })
    public ResponseEntity<List<OrderResponse>> getOrdersByCustomerId(
            @Parameter(description = "Customer ID") @PathVariable String customerId) {

        log.debug("REST request to get orders by customer ID: {}", customerId);
        List<OrderResponse> response = orderService.getOrdersByCustomerId(customerId);
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/customer/{customerId}/paginated", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Get orders by customer paginated", description = "Retrieves paginated list of orders for a specific customer")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Orders retrieved successfully")
    })
    public ResponseEntity<Page<OrderResponse>> getOrdersByCustomerIdPaginated(
            @Parameter(description = "Customer ID") @PathVariable String customerId,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "createdAt") String sort,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String direction) {

        log.debug("REST request to get orders by customer ID: {} with pagination", customerId);
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        Page<OrderResponse> response = orderService.getOrdersByCustomerId(customerId, pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/drop/{dropId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS')")
    @Operation(summary = "Get orders by drop", description = "Retrieves all orders for a specific drop")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Orders retrieved successfully")
    })
    public ResponseEntity<List<OrderResponse>> getOrdersByDropId(
            @Parameter(description = "Drop ID") @PathVariable String dropId) {

        log.debug("REST request to get orders by drop ID: {}", dropId);
        List<OrderResponse> response = orderService.getOrdersByDropId(dropId);
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/drop/{dropId}/paginated", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS')")
    @Operation(summary = "Get orders by drop paginated", description = "Retrieves paginated list of orders for a specific drop")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Orders retrieved successfully")
    })
    public ResponseEntity<Page<OrderResponse>> getOrdersByDropIdPaginated(
            @Parameter(description = "Drop ID") @PathVariable String dropId,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "createdAt") String sort,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String direction) {

        log.debug("REST request to get orders by drop ID: {} with pagination", dropId);
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        Page<OrderResponse> response = orderService.getOrdersByDropId(dropId, pageable);

        return ResponseEntity.ok(response);
    }

    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS')")
    @Operation(summary = "Update an order", description = "Updates an existing order")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Order updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<OrderResponse> updateOrder(
            @Parameter(description = "Order ID") @PathVariable String id,
            @Valid @RequestBody UpdateOrderRequest request) {

        log.info("REST request to update order: {}", id);
        OrderResponse result = orderService.updateOrder(id, request);

        return ResponseEntity.ok(result);
    }

    @PostMapping(value = "/{id}/ship", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS')")
    @Operation(summary = "Ship an order", description = "Marks an order as shipped")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Order shipped successfully"),
        @ApiResponse(responseCode = "400", description = "Order cannot be shipped"),
        @ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<OrderResponse> shipOrder(
            @Parameter(description = "Order ID") @PathVariable String id,
            @Parameter(description = "Tracking number") @RequestParam String trackingNumber) {

        log.info("REST request to ship order: {}", id);
        OrderResponse result = orderService.shipOrder(id, trackingNumber);

        return ResponseEntity.ok(result);
    }

    @PostMapping(value = "/{id}/deliver", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS')")
    @Operation(summary = "Mark order as delivered", description = "Marks an order as delivered")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Order marked as delivered successfully"),
        @ApiResponse(responseCode = "400", description = "Order cannot be marked as delivered"),
        @ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<OrderResponse> markAsDelivered(
            @Parameter(description = "Order ID") @PathVariable String id) {

        log.info("REST request to mark order as delivered: {}", id);
        OrderResponse result = orderService.markAsDelivered(id);

        return ResponseEntity.ok(result);
    }

    @PostMapping(value = "/{id}/cancel", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS', 'CUSTOMER')")
    @Operation(summary = "Cancel an order", description = "Cancels an order")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Order cancelled successfully"),
        @ApiResponse(responseCode = "400", description = "Order cannot be cancelled"),
        @ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<OrderResponse> cancelOrder(
            @Parameter(description = "Order ID") @PathVariable String id,
            @Parameter(description = "Cancellation reason") @RequestParam(required = false) String reason) {

        log.info("REST request to cancel order: {}", id);
        OrderResponse result = orderService.cancelOrder(id, reason);

        return ResponseEntity.ok(result);
    }

    @PostMapping(value = "/{id}/refund", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'OPS')")
    @Operation(summary = "Refund an order", description = "Refunds an order")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Order refunded successfully"),
        @ApiResponse(responseCode = "400", description = "Order cannot be refunded"),
        @ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<OrderResponse> refundOrder(
            @Parameter(description = "Order ID") @PathVariable String id) {

        log.info("REST request to refund order: {}", id);
        OrderResponse result = orderService.refundOrder(id);

        return ResponseEntity.ok(result);
    }
}
