package com.retrorise.drop.domain.model;

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

import java.time.LocalDateTime;

/**
 * Entity representing a drop in the RetroRise platform.
 */
@Entity
@Table(name = "drops")
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Drop {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "brand_id", nullable = false)
    private String brandId;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "total_stock", nullable = false)
    private Integer totalStock;

    @Column(name = "available_stock", nullable = false)
    private Integer availableStock;

    @Column(name = "max_items_per_customer")
    private Integer maxItemsPerCustomer;

    @Column(name = "early_access_start_date")
    private LocalDateTime earlyAccessStartDate;

    @Column(name = "early_access_end_date")
    private LocalDateTime earlyAccessEndDate;

    @Column(name = "early_access_roles")
    private String earlyAccessRoles;

    @Column(name = "is_published")
    @Builder.Default
    private Boolean isPublished = false;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

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

    /**
     * Checks if the drop is currently active.
     *
     * @return true if the drop is currently active, false otherwise
     */
    public boolean isCurrentlyActive() {
        LocalDateTime now = LocalDateTime.now();
        return isActive && isPublished && 
               (now.isEqual(startDate) || now.isAfter(startDate)) && 
               (now.isEqual(endDate) || now.isBefore(endDate));
    }

    /**
     * Checks if early access is currently active.
     *
     * @return true if early access is currently active, false otherwise
     */
    public boolean isEarlyAccessActive() {
        if (earlyAccessStartDate == null || earlyAccessEndDate == null) {
            return false;
        }

        LocalDateTime now = LocalDateTime.now();
        return isActive && isPublished && 
               (now.isEqual(earlyAccessStartDate) || now.isAfter(earlyAccessStartDate)) && 
               (now.isEqual(earlyAccessEndDate) || now.isBefore(earlyAccessEndDate));
    }

    /**
     * Checks if a user with given roles has early access to this drop.
     *
     * @param userRoles The roles of the user
     * @return true if the user has early access, false otherwise
     */
    public boolean hasEarlyAccess(String[] userRoles) {
        if (earlyAccessRoles == null || earlyAccessRoles.isEmpty() || 
            userRoles == null || userRoles.length == 0) {
            return false;
        }

        String[] allowedRoles = earlyAccessRoles.split(",");
        for (String userRole : userRoles) {
            for (String allowedRole : allowedRoles) {
                if (userRole.trim().equalsIgnoreCase(allowedRole.trim())) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Checks if a user can access this drop (either through early access or regular access).
     *
     * @param userRoles The roles of the user
     * @return true if the user can access this drop, false otherwise
     */
    public boolean canAccess(String[] userRoles) {
        if (isCurrentlyActive()) {
            return true;
        }

        if (isEarlyAccessActive() && hasEarlyAccess(userRoles)) {
            return true;
        }

        return false;
    }

    /**
     * Checks if stock is available for purchase.
     *
     * @return true if stock is available, false otherwise
     */
    public boolean hasStockAvailable() {
        return availableStock != null && availableStock > 0;
    }

    /**
     * Decrements the available stock by the specified quantity.
     *
     * @param quantity The quantity to decrement
     * @throws IllegalArgumentException if quantity is invalid or insufficient stock
     */
    public void decrementStock(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        if (!hasStockAvailable()) {
            throw new IllegalArgumentException("No stock available");
        }

        if (availableStock < quantity) {
            throw new IllegalArgumentException("Insufficient stock");
        }

        availableStock -= quantity;
    }
}
