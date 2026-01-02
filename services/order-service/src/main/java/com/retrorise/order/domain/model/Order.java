package com.retrorise.order.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing an order in the RetroRise platform.
 */
@Entity
@Table(name = "orders")
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "customer_id", nullable = false)
    private String customerId;

    @Column(name = "customer_email", nullable = false)
    private String customerEmail;

    @Column(name = "drop_id", nullable = false)
    private String dropId;

    @Column(name = "drop_name", nullable = false)
    private String dropName;

    @Column(name = "brand_id", nullable = false)
    private String brandId;

    @Column(name = "brand_name", nullable = false)
    private String brandName;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "currency", length = 3, nullable = false)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @Column(name = "payment_id")
    private String paymentId;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(name = "shipping_address", length = 500)
    private String shippingAddress;

    @Column(name = "billing_address", length = 500)
    private String billingAddress;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "shipped_date")
    private LocalDateTime shippedDate;

    @Column(name = "delivered_date")
    private LocalDateTime deliveredDate;

    @Column(name = "cancelled_date")
    private LocalDateTime cancelledDate;

    @Column(name = "cancellation_reason")
    private String cancellationReason;

    @Column(name = "created_at", updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Column(name = "created_by", updatable = false, length = 255)
    @CreatedBy
    private String createdBy;

    @Column(name = "updated_by", length = 255)
    @LastModifiedBy
    private String updatedBy;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    /**
     * Order status enumeration.
     */
    public enum OrderStatus {
        PENDING,
        PROCESSING,
        PAID,
        SHIPPED,
        DELIVERED,
        CANCELLED,
        REFUNDED
    }

    /**
     * Checks if the order can be paid.
     *
     * @return true if the order can be paid, false otherwise
     */
    public boolean canBePaid() {
        return status == OrderStatus.PENDING;
    }

    /**
     * Checks if the order can be shipped.
     *
     * @return true if the order can be shipped, false otherwise
     */
    public boolean canBeShipped() {
        return status == OrderStatus.PAID;
    }

    /**
     * Checks if the order can be delivered.
     *
     * @return true if the order can be delivered, false otherwise
     */
    public boolean canBeDelivered() {
        return status == OrderStatus.SHIPPED;
    }

    /**
     * Checks if the order can be cancelled.
     *
     * @return true if the order can be cancelled, false otherwise
     */
    public boolean canBeCancelled() {
        return status == OrderStatus.PENDING || status == OrderStatus.PROCESSING || status == OrderStatus.PAID;
    }

    /**
     * Checks if the order can be refunded.
     *
     * @return true if the order can be refunded, false otherwise
     */
    public boolean canBeRefunded() {
        return status == OrderStatus.PAID || status == OrderStatus.SHIPPED || status == OrderStatus.DELIVERED;
    }

    /**
     * Marks the order as paid.
     */
    public void markAsPaid(String paymentId) {
        if (!canBePaid()) {
            throw new IllegalStateException("Order cannot be paid in its current state: " + status);
        }

        this.status = OrderStatus.PAID;
        this.paymentId = paymentId;
        this.paymentDate = LocalDateTime.now();
    }

    /**
     * Marks the order as shipped.
     */
    public void markAsShipped(String trackingNumber) {
        if (!canBeShipped()) {
            throw new IllegalStateException("Order cannot be shipped in its current state: " + status);
        }

        this.status = OrderStatus.SHIPPED;
        this.trackingNumber = trackingNumber;
        this.shippedDate = LocalDateTime.now();
    }

    /**
     * Marks the order as delivered.
     */
    public void markAsDelivered() {
        if (!canBeDelivered()) {
            throw new IllegalStateException("Order cannot be delivered in its current state: " + status);
        }

        this.status = OrderStatus.DELIVERED;
        this.deliveredDate = LocalDateTime.now();
    }

    /**
     * Cancels the order.
     */
    public void cancel(String reason) {
        if (!canBeCancelled()) {
            throw new IllegalStateException("Order cannot be cancelled in its current state: " + status);
        }

        this.status = OrderStatus.CANCELLED;
        this.cancellationReason = reason;
        this.cancelledDate = LocalDateTime.now();
    }

    /**
     * Refunds the order.
     */
    public void refund() {
        if (!canBeRefunded()) {
            throw new IllegalStateException("Order cannot be refunded in its current state: " + status);
        }

        this.status = OrderStatus.REFUNDED;
    }
}
