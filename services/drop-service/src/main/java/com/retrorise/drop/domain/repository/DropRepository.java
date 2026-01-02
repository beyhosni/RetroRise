package com.retrorise.drop.domain.repository;

import com.retrorise.drop.domain.model.Drop;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Drop entities.
 */
@Repository
public interface DropRepository extends JpaRepository<Drop, String> {

    /**
     * Finds a drop by name.
     *
     * @param name The drop name
     * @return Optional containing the drop if found
     */
    Optional<Drop> findByName(String name);

    /**
     * Finds all published drops.
     *
     * @return List of published drops
     */
    List<Drop> findByIsPublishedTrue();

    /**
     * Finds published drops with pagination.
     *
     * @param pageable Pagination parameters
     * @return Page of published drops
     */
    Page<Drop> findByIsPublishedTrue(Pageable pageable);

    /**
     * Finds active drops (published and currently active).
     *
     * @return List of active drops
     */
    @Query("SELECT d FROM Drop d WHERE d.isPublished = true AND d.isActive = true " +
           "AND d.startDate <= :now AND d.endDate >= :now")
    List<Drop> findActiveDrops(@Param("now") LocalDateTime now);

    /**
     * Finds active drops with pagination.
     *
     * @param now Current date/time
     * @param pageable Pagination parameters
     * @return Page of active drops
     */
    @Query("SELECT d FROM Drop d WHERE d.isPublished = true AND d.isActive = true " +
           "AND d.startDate <= :now AND d.endDate >= :now")
    Page<Drop> findActiveDrops(@Param("now") LocalDateTime now, Pageable pageable);

    /**
     * Finds drops by brand ID.
     *
     * @param brandId The brand ID
     * @return List of drops for the brand
     */
    List<Drop> findByBrandId(String brandId);

    /**
     * Finds drops by brand ID with pagination.
     *
     * @param brandId The brand ID
     * @param pageable Pagination parameters
     * @return Page of drops for the brand
     */
    Page<Drop> findByBrandId(String brandId, Pageable pageable);

    /**
     * Finds published drops by brand ID.
     *
     * @param brandId The brand ID
     * @return List of published drops for the brand
     */
    List<Drop> findByBrandIdAndIsPublishedTrue(String brandId);

    /**
     * Finds published drops by brand ID with pagination.
     *
     * @param brandId The brand ID
     * @param pageable Pagination parameters
     * @return Page of published drops for the brand
     */
    Page<Drop> findByBrandIdAndIsPublishedTrue(String brandId, Pageable pageable);

    /**
     * Searches for drops by name or description containing the search term.
     *
     * @param searchTerm The search term
     * @param pageable Pagination parameters
     * @return Page of matching drops
     */
    @Query("SELECT d FROM Drop d WHERE d.isPublished = true AND d.isActive = true AND " +
           "(LOWER(d.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Drop> searchActiveDrops(@Param("searchTerm") String searchTerm, Pageable pageable);

    /**
     * Finds drops with early access currently active.
     *
     * @param now Current date/time
     * @return List of drops with active early access
     */
    @Query("SELECT d FROM Drop d WHERE d.isPublished = true AND d.isActive = true " +
           "AND d.earlyAccessStartDate <= :now AND d.earlyAccessEndDate >= :now")
    List<Drop> findDropsWithActiveEarlyAccess(@Param("now") LocalDateTime now);

    /**
     * Finds drops that will start within the specified time range.
     *
     * @param start Start of the time range
     * @param end End of the time range
     * @return List of drops starting in the time range
     */
    @Query("SELECT d FROM Drop d WHERE d.isPublished = true AND d.isActive = true " +
           "AND d.startDate BETWEEN :start AND :end")
    List<Drop> findDropsStartingInRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    /**
     * Finds drops that are currently in early access phase.
     *
     * @param now Current date/time
     * @param pageable Pagination parameters
     * @return Page of drops in early access phase
     */
    @Query("SELECT d FROM Drop d WHERE d.isPublished = true AND d.isActive = true " +
           "AND d.earlyAccessStartDate <= :now AND d.earlyAccessEndDate >= :now")
    Page<Drop> findDropsInEarlyAccessPhase(@Param("now") LocalDateTime now, Pageable pageable);
}
