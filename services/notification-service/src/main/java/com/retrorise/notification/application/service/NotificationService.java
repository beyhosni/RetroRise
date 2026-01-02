package com.retrorise.notification.application.service;

import com.retrorise.notification.application.dto.NotificationRequest;
import com.retrorise.notification.application.dto.NotificationResponse;
import com.retrorise.notification.application.mapper.NotificationMapper;
import com.retrorise.notification.domain.model.Notification;
import com.retrorise.notification.domain.repository.NotificationRepository;
import com.retrorise.sharedkernel.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing notifications.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final EmailService emailService;

    /**
     * Creates a new notification.
     *
     * @param request The notification request
     * @return The created notification
     */
    @Transactional
    public NotificationResponse createNotification(NotificationRequest request) {
        log.info("Creating new notification for recipient: {}", request.getRecipientEmail());

        // Create notification entity
        Notification notification = notificationMapper.toEntity(request);

        // Save notification
        Notification savedNotification = notificationRepository.save(notification);
        log.info("Notification created with ID: {}", savedNotification.getId());

        // Try to send the notification immediately
        sendNotification(savedNotification);

        return notificationMapper.toResponse(savedNotification);
    }

    /**
     * Gets a notification by ID.
     *
     * @param id The notification ID
     * @return The notification
     */
    public NotificationResponse getNotificationById(String id) {
        log.debug("Fetching notification with ID: {}", id);

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", id));

        return notificationMapper.toResponse(notification);
    }

    /**
     * Gets all notifications with pagination.
     *
     * @param pageable Pagination parameters
     * @return Page of notifications
     */
    public Page<NotificationResponse> getAllNotifications(Pageable pageable) {
        log.debug("Fetching all notifications with pagination");

        return notificationRepository.findAll(pageable)
                .map(notificationMapper::toResponse);
    }

    /**
     * Gets notifications by recipient ID.
     *
     * @param recipientId The recipient ID
     * @return List of notifications for the recipient
     */
    public List<NotificationResponse> getNotificationsByRecipientId(String recipientId) {
        log.debug("Fetching notifications by recipient ID: {}", recipientId);

        return notificationRepository.findByRecipientId(recipientId).stream()
                .map(notificationMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Gets notifications by recipient ID with pagination.
     *
     * @param recipientId The recipient ID
     * @param pageable Pagination parameters
     * @return Page of notifications for the recipient
     */
    public Page<NotificationResponse> getNotificationsByRecipientId(String recipientId, Pageable pageable) {
        log.debug("Fetching notifications by recipient ID: {} with pagination", recipientId);

        return notificationRepository.findByRecipientId(recipientId, pageable)
                .map(notificationMapper::toResponse);
    }

    /**
     * Marks a notification as read.
     *
     * @param id The notification ID
     * @return The updated notification
     */
    @Transactional
    public NotificationResponse markAsRead(String id) {
        log.info("Marking notification as read: {}", id);

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", id));

        notification.markAsRead();
        Notification updatedNotification = notificationRepository.save(notification);

        return notificationMapper.toResponse(updatedNotification);
    }

    /**
     * Sends a notification.
     *
     * @param notification The notification to send
     * @return true if the notification was sent successfully, false otherwise
     */
    @Transactional
    public boolean sendNotification(Notification notification) {
        log.info("Sending notification: {}", notification.getId());

        try {
            // Send email notification
            boolean emailSent = emailService.sendNotificationEmail(notification);

            if (emailSent) {
                notification.markAsSent();
                notificationRepository.save(notification);
                log.info("Notification sent successfully: {}", notification.getId());
                return true;
            } else {
                notification.markAsFailed("Failed to send email");
                notificationRepository.save(notification);
                log.warn("Failed to send notification: {}", notification.getId());
                return false;
            }
        } catch (Exception e) {
            log.error("Error sending notification: {}", notification.getId(), e);
            notification.markAsFailed(e.getMessage());
            notificationRepository.save(notification);
            return false;
        }
    }

    /**
     * Scheduled task to retry failed notifications.
     * Runs every 5 minutes.
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    @Transactional
    public void retryFailedNotifications() {
        log.info("Checking for failed notifications to retry");

        List<Notification> notificationsToRetry = 
                notificationRepository.findNotificationsToRetry(LocalDateTime.now());

        log.info("Found {} notifications to retry", notificationsToRetry.size());

        for (Notification notification : notificationsToRetry) {
            log.info("Retrying notification: {}", notification.getId());
            notification.resetForRetry();
            sendNotification(notification);
        }
    }

    /**
     * Gets the count of unread notifications for a recipient.
     *
     * @param recipientId The recipient ID
     * @return The count of unread notifications
     */
    public long getUnreadCount(String recipientId) {
        return notificationRepository.countUnreadByRecipientId(recipientId);
    }
}
