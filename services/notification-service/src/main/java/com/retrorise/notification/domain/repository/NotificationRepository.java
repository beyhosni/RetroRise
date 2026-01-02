package com.retrorise.notification.domain.repository;

import com.retrorise.notification.domain.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for Notification entities.
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {

    /**
     * Finds notifications by recipient ID.
     *
     * @param recipientId The recipient ID
     * @return List of notifications for the recipient
     */
    List<Notification> findByRecipientId(String recipientId);

    /**
     * Finds notifications by recipient ID with pagination.
     *
     * @param recipientId The recipient ID
     * @param pageable Pagination parameters
     * @return Page of notifications for the recipient
     */
    Page<Notification> findByRecipientId(String recipientId, Pageable pageable);

    /**
     * Finds notifications by recipient email.
     *
     * @param recipientEmail The recipient email
     * @return List of notifications for the recipient
     */
    List<Notification> findByRecipientEmail(String recipientEmail);

    /**
     * Finds notifications by recipient email with pagination.
     *
     * @param recipientEmail The recipient email
     * @param pageable Pagination parameters
     * @return Page of notifications for the recipient
     */
    Page<Notification> findByRecipientEmail(String recipientEmail, Pageable pageable);

    /**
     * Finds notifications by type.
     *
     * @param type The notification type
     * @return List of notifications with the type
     */
    List<Notification> findByType(Notification.NotificationType type);

    /**
     * Finds notifications by type with pagination.
     *
     * @param type The notification type
     * @param pageable Pagination parameters
     * @return Page of notifications with the type
     */
    Page<Notification> findByType(Notification.NotificationType type, Pageable pageable);

    /**
     * Finds notifications by status.
     *
     * @param status The notification status
     * @return List of notifications with the status
     */
    List<Notification> findByStatus(Notification.NotificationStatus status);

    /**
     * Finds notifications by status with pagination.
     *
     * @param status The notification status
     * @param pageable Pagination parameters
     * @return Page of notifications with the status
     */
    Page<Notification> findByStatus(Notification.NotificationStatus status, Pageable pageable);

    /**
     * Finds notifications by related entity.
     *
     * @param entityType The related entity type
     * @param entityId The related entity ID
     * @return List of notifications for the entity
     */
    List<Notification> findByRelatedEntityTypeAndRelatedEntityId(String entityType, String entityId);

    /**
     * Finds notifications that need to be retried.
     *
     * @param now The current time
     * @return List of notifications that can be retried
     */
    @Query("SELECT n FROM Notification n WHERE n.status = 'FAILED' AND n.retryCount < n.maxRetries AND n.nextRetryAt <= :now")
    List<Notification> findNotificationsToRetry(@Param("now") LocalDateTime now);

    /**
     * Counts notifications by recipient ID.
     *
     * @param recipientId The recipient ID
     * @return The number of notifications for the recipient
     */
    long countByRecipientId(String recipientId);

    /**
     * Counts unread notifications by recipient ID.
     *
     * @param recipientId The recipient ID
     * @return The number of unread notifications for the recipient
     */
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipientId = :recipientId AND n.status != 'READ'")
    long countUnreadByRecipientId(@Param("recipientId") String recipientId);

    /**
     * Counts notifications by type.
     *
     * @param type The notification type
     * @return The number of notifications with the type
     */
    long countByType(Notification.NotificationType type);

    /**
     * Counts notifications by status.
     *
     * @param status The notification status
     * @return The number of notifications with the status
     */
    long countByStatus(Notification.NotificationStatus status);
}
