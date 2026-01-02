package com.retrorise.notification.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Entity representing a notification in the RetroRise platform.
 */
@Entity
@Table(name = "notifications")
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "recipient_id", nullable = false)
    private String recipientId;

    @Column(name = "recipient_email", nullable = false)
    private String recipientEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private NotificationStatus status = NotificationStatus.PENDING;

    @Column(name = "related_entity_type")
    private String relatedEntityType;

    @Column(name = "related_entity_id")
    private String relatedEntityId;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "retry_count")
    @Builder.Default
    private Integer retryCount = 0;

    @Column(name = "max_retries")
    @Builder.Default
    private Integer maxRetries = 3;

    @Column(name = "next_retry_at")
    private LocalDateTime nextRetryAt;

    @Column(name = "created_at", updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Column(name = "created_by", updatable = false, length = 255)
    @CreatedBy
    private String createdBy;

    /**
     * Notification type enumeration.
     */
    public enum NotificationType {
        ORDER_CONFIRMATION,
        ORDER_SHIPPED,
        ORDER_DELIVERED,
        ORDER_CANCELLED,
        ORDER_REFUNDED,
        DROP_ANNOUNCEMENT,
        DROP_EARLY_ACCESS,
        DROP_LIVE,
        DROP_ENDING_SOON,
        STOCK_ALERT,
        DELIVERY_UPDATE,
        PROMOTION,
        SYSTEM
    }

    /**
     * Notification status enumeration.
     */
    public enum NotificationStatus {
        PENDING,
        SENT,
        READ,
        FAILED
    }

    /**
     * Marks the notification as sent.
     */
    public void markAsSent() {
        this.status = NotificationStatus.SENT;
        this.sentAt = LocalDateTime.now();
    }

    /**
     * Marks the notification as read.
     */
    public void markAsRead() {
        this.status = NotificationStatus.READ;
        this.readAt = LocalDateTime.now();
    }

    /**
     * Marks the notification as failed.
     *
     * @param errorMessage The error message
     */
    public void markAsFailed(String errorMessage) {
        this.status = NotificationStatus.FAILED;
        this.errorMessage = errorMessage;
        this.retryCount++;

        // Schedule a retry if max retries not reached
        if (this.retryCount < this.maxRetries) {
            // Exponential backoff: 5min, 15min, 45min
            int minutes = 5 * (int) Math.pow(3, this.retryCount - 1);
            this.nextRetryAt = LocalDateTime.now().plusMinutes(minutes);
        }
    }

    /**
     * Resets the notification for a retry.
     */
    public void resetForRetry() {
        this.status = NotificationStatus.PENDING;
        this.errorMessage = null;
    }

    /**
     * Checks if the notification can be retried.
     *
     * @return true if the notification can be retried, false otherwise
     */
    public boolean canRetry() {
        return this.status == NotificationStatus.FAILED && 
               this.retryCount < this.maxRetries && 
               this.nextRetryAt != null && 
               LocalDateTime.now().isAfter(this.nextRetryAt);
    }
}
