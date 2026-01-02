package com.retrorise.brand.domain.model;

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
 * Entity representing a brand in the RetroRise platform.
 */
@Entity
@Table(name = "brands")
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(nullable = false)
    private String industry;

    @Column(name = "founding_year")
    private Integer foundingYear;

    @Column(name = "country_of_origin")
    private String countryOfOrigin;

    @Column(name = "website_url")
    private String websiteUrl;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "acquisition_score")
    private Integer acquisitionScore;

    @Column(name = "market_potential_score")
    private Integer marketPotentialScore;

    @Column(name = "revival_complexity_score")
    private Integer revivalComplexityScore;

    @Column(name = "overall_score")
    private Integer overallScore;

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
     * Calculates the overall brand score based on individual component scores.
     * The overall score is a weighted average:
     * - Acquisition score: 40%
     * - Market potential score: 35%
     * - Revival complexity score: 25%
     */
    public void calculateOverallScore() {
        if (acquisitionScore != null && marketPotentialScore != null && revivalComplexityScore != null) {
            this.overallScore = (int) Math.round(
                (acquisitionScore * 0.4) + 
                (marketPotentialScore * 0.35) + 
                (revivalComplexityScore * 0.25)
            );
        }
    }
}
