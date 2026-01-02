package com.retrorise.notification.application.mapper;

import com.retrorise.notification.application.dto.NotificationRequest;
import com.retrorise.notification.application.dto.NotificationResponse;
import com.retrorise.notification.domain.model.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for Notification entities and DTOs.
 */
@Mapper(componentModel = "spring")
public interface NotificationMapper {

    /**
     * Maps a NotificationRequest to a Notification entity.
     *
     * @param request The notification request
     * @return The notification entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "sentAt", ignore = true)
    @Mapping(target = "readAt", ignore = true)
    @Mapping(target = "errorMessage", ignore = true)
    @Mapping(target = "retryCount", ignore = true)
    @Mapping(target = "maxRetries", ignore = true)
    @Mapping(target = "nextRetryAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    Notification toEntity(NotificationRequest request);

    /**
     * Maps a Notification entity to a NotificationResponse.
     *
     * @param notification The notification entity
     * @return The notification response
     */
    NotificationResponse toResponse(Notification notification);
}
