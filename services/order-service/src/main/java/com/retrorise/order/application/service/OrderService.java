package com.retrorise.order.application.service;

import com.retrorise.order.application.dto.OrderResponse;
import com.retrorise.order.application.dto.CreateOrderRequest;
import com.retrorise.order.application.dto.UpdateOrderRequest;
import com.retrorise.order.application.dto.PaymentRequest;
import com.retrorise.order.application.dto.PaymentResponse;
import com.retrorise.order.application.mapper.OrderMapper;
import com.retrorise.order.domain.model.Order;
import com.retrorise.order.domain.model.OrderItem;
import com.retrorise.order.domain.repository.OrderRepository;
import com.retrorise.sharedkernel.domain.event.OrderPlacedEvent;
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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing orders.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final MockPaymentService mockPaymentService;
    private final DomainEventPublisher eventPublisher;

    @Value("${kafka.topics.order-events}")
    private String orderEventsTopic;

    /**
     * Creates a new order.
     *
     * @param request The create order request
     * @return The created order
     */
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        log.info("Creating new order for customer: {}", request.getCustomerId());

        // Create order entity
        Order order = orderMapper.toEntity(request);
        order.setCreatedBy(getCurrentUser());

        // Process order items if provided
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            List<OrderItem> items = request.getItems().stream()
                    .map(itemRequest -> {
                        OrderItem item = OrderItem.builder()
                                .productId(itemRequest.getProductId())
                                .productName(itemRequest.getProductName())
                                .productDescription(itemRequest.getProductDescription())
                                .productImageUrl(itemRequest.getProductImageUrl())
                                .size(itemRequest.getSize())
                                .color(itemRequest.getColor())
                                .quantity(itemRequest.getQuantity())
                                .currency(request.getCurrency())
                                .unitPrice(order.getUnitPrice())
                                .build();
                        item.calculateTotalPrice();
                        item.setOrder(order);
                        return item;
                    })
                    .collect(Collectors.toList());

            order.setItems(items);

            // Update total price based on items
            BigDecimal itemsTotalPrice = items.stream()
                    .map(OrderItem::getTotalPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            order.setTotalPrice(itemsTotalPrice);
        } else {
            // Calculate total price from quantity and unit price
            order.setTotalPrice(order.getUnitPrice().multiply(BigDecimal.valueOf(order.getQuantity())));
        }

        // Save order
        Order savedOrder = orderRepository.save(order);
        log.info("Order created with ID: {}", savedOrder.getId());

        // Publish OrderPlaced event
        publishOrderPlacedEvent(savedOrder);

        return orderMapper.toResponse(savedOrder);
    }

    /**
     * Gets an order by ID.
     *
     * @param id The order ID
     * @return The order
     */
    public OrderResponse getOrderById(String id) {
        log.debug("Fetching order with ID: {}", id);

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));

        return orderMapper.toResponse(order);
    }

    /**
     * Gets all orders with pagination.
     *
     * @param pageable Pagination parameters
     * @return Page of orders
     */
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        log.debug("Fetching all orders with pagination");

        return orderRepository.findAll(pageable)
                .map(orderMapper::toResponse);
    }

    /**
     * Gets orders by customer ID.
     *
     * @param customerId The customer ID
     * @return List of orders for the customer
     */
    public List<OrderResponse> getOrdersByCustomerId(String customerId) {
        log.debug("Fetching orders by customer ID: {}", customerId);

        return orderRepository.findByCustomerId(customerId).stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Gets orders by customer ID with pagination.
     *
     * @param customerId The customer ID
     * @param pageable Pagination parameters
     * @return Page of orders for the customer
     */
    public Page<OrderResponse> getOrdersByCustomerId(String customerId, Pageable pageable) {
        log.debug("Fetching orders by customer ID: {} with pagination", customerId);

        return orderRepository.findByCustomerId(customerId, pageable)
                .map(orderMapper::toResponse);
    }

    /**
     * Gets orders by drop ID.
     *
     * @param dropId The drop ID
     * @return List of orders for the drop
     */
    public List<OrderResponse> getOrdersByDropId(String dropId) {
        log.debug("Fetching orders by drop ID: {}", dropId);

        return orderRepository.findByDropId(dropId).stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Gets orders by drop ID with pagination.
     *
     * @param dropId The drop ID
     * @param pageable Pagination parameters
     * @return Page of orders for the drop
     */
    public Page<OrderResponse> getOrdersByDropId(String dropId, Pageable pageable) {
        log.debug("Fetching orders by drop ID: {} with pagination", dropId);

        return orderRepository.findByDropId(dropId, pageable)
                .map(orderMapper::toResponse);
    }

    /**
     * Processes payment for an order.
     *
     * @param request The payment request
     * @return The payment response
     */
    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        log.info("Processing payment for order: {}", request.getOrderId());

        // Get the order
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", request.getOrderId()));

        // Check if order can be paid
        if (!order.canBePaid()) {
            throw new DomainException("INVALID_ORDER_STATUS", 
                String.format("Order cannot be paid in its current state: %s", order.getStatus()));
        }

        // Process payment using mock payment service
        PaymentResponse paymentResponse = mockPaymentService.processPayment(request);

        // Update order if payment was successful
        if (paymentResponse.getStatus() == PaymentResponse.PaymentStatus.COMPLETED) {
            order.markAsPaid(paymentResponse.getPaymentId());
            orderRepository.save(order);

            log.info("Order {} paid successfully with payment ID: {}", 
                    order.getId(), paymentResponse.getPaymentId());
        } else {
            log.warn("Payment failed for order {}: {}", 
                    order.getId(), paymentResponse.getMessage());
        }

        return paymentResponse;
    }

    /**
     * Updates an order.
     *
     * @param id The order ID
     * @param request The update order request
     * @return The updated order
     */
    @Transactional
    public OrderResponse updateOrder(String id, UpdateOrderRequest request) {
        log.info("Updating order with ID: {}", id);

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));

        // Update order fields
        orderMapper.updateEntityFromRequest(order, request);
        order.setUpdatedBy(getCurrentUser());

        // Save updated order
        Order updatedOrder = orderRepository.save(order);
        log.info("Order updated with ID: {}", updatedOrder.getId());

        return orderMapper.toResponse(updatedOrder);
    }

    /**
     * Ships an order.
     *
     * @param id The order ID
     * @param trackingNumber The tracking number
     * @return The updated order
     */
    @Transactional
    public OrderResponse shipOrder(String id, String trackingNumber) {
        log.info("Shipping order with ID: {}", id);

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));

        // Mark order as shipped
        order.markAsShipped(trackingNumber);

        // Save updated order
        Order updatedOrder = orderRepository.save(order);
        log.info("Order shipped with ID: {}", updatedOrder.getId());

        return orderMapper.toResponse(updatedOrder);
    }

    /**
     * Marks an order as delivered.
     *
     * @param id The order ID
     * @return The updated order
     */
    @Transactional
    public OrderResponse markAsDelivered(String id) {
        log.info("Marking order with ID: {} as delivered", id);

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));

        // Mark order as delivered
        order.markAsDelivered();

        // Save updated order
        Order updatedOrder = orderRepository.save(order);
        log.info("Order marked as delivered with ID: {}", updatedOrder.getId());

        return orderMapper.toResponse(updatedOrder);
    }

    /**
     * Cancels an order.
     *
     * @param id The order ID
     * @param reason The cancellation reason
     * @return The updated order
     */
    @Transactional
    public OrderResponse cancelOrder(String id, String reason) {
        log.info("Cancelling order with ID: {}", id);

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));

        // Cancel order
        order.cancel(reason);

        // Save updated order
        Order updatedOrder = orderRepository.save(order);
        log.info("Order cancelled with ID: {}", updatedOrder.getId());

        return orderMapper.toResponse(updatedOrder);
    }

    /**
     * Refunds an order.
     *
     * @param id The order ID
     * @return The updated order
     */
    @Transactional
    public OrderResponse refundOrder(String id) {
        log.info("Refunding order with ID: {}", id);

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));

        // Refund payment if exists
        if (order.getPaymentId() != null) {
            mockPaymentService.refundPayment(order.getPaymentId());
        }

        // Mark order as refunded
        order.refund();

        // Save updated order
        Order updatedOrder = orderRepository.save(order);
        log.info("Order refunded with ID: {}", updatedOrder.getId());

        return orderMapper.toResponse(updatedOrder);
    }

    /**
     * Publishes an OrderPlaced event to Kafka.
     *
     * @param order The order that was placed
     */
    private void publishOrderPlacedEvent(Order order) {
        OrderPlacedEvent event = OrderPlacedEvent.builder()
                .aggregateId(order.getId())
                .aggregateType("Order")
                .eventType("OrderPlaced")
                .version("v1")
                .orderId(order.getId())
                .customerId(order.getCustomerId())
                .customerEmail(order.getCustomerEmail())
                .dropId(order.getDropId())
                .dropName(order.getDropName())
                .brandId(order.getBrandId())
                .brandName(order.getBrandName())
                .quantity(order.getQuantity())
                .totalPrice(order.getTotalPrice())
                .currency(order.getCurrency())
                .status(order.getStatus().name())
                .createdAt(order.getCreatedAt())
                .build();

        eventPublisher.publish(orderEventsTopic, event);
        log.debug("Published OrderPlaced event for order ID: {}", order.getId());
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
