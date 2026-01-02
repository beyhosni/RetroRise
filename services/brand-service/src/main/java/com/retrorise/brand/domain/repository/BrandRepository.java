package com.retrorise.brand.domain.repository;

import com.retrorise.brand.domain.model.Brand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Brand entities.
 */
@Repository
public interface BrandRepository extends JpaRepository<Brand, String> {

    /**
     * Finds a brand by name.
     *
     * @param name The brand name
     * @return Optional containing the brand if found
     */
    Optional<Brand> findByName(String name);

    /**
     * Finds all active brands.
     *
     * @return List of active brands
     */
    List<Brand> findByIsActiveTrue();

    /**
     * Finds active brands with pagination.
     *
     * @param pageable Pagination parameters
     * @return Page of active brands
     */
    Page<Brand> findByIsActiveTrue(Pageable pageable);

    /**
     * Finds brands by industry.
     *
     * @param industry The industry
     * @return List of brands in the industry
     */
    List<Brand> findByIndustry(String industry);

    /**
     * Finds brands by industry with pagination.
     *
     * @param industry The industry
     * @param pageable Pagination parameters
     * @return Page of brands in the industry
     */
    Page<Brand> findByIndustry(String industry, Pageable pageable);

    /**
     * Finds brands with an overall score greater than or equal to the specified value.
     *
     * @param minScore The minimum score
     * @return List of brands with score >= minScore
     */
    List<Brand> findByOverallScoreGreaterThanEqual(Integer minScore);

    /**
     * Finds brands with an overall score greater than or equal to the specified value with pagination.
     *
     * @param minScore The minimum score
     * @param pageable Pagination parameters
     * @return Page of brands with score >= minScore
     */
    Page<Brand> findByOverallScoreGreaterThanEqual(Integer minScore, Pageable pageable);

    /**
     * Searches for brands by name or description containing the search term.
     *
     * @param searchTerm The search term
     * @param pageable Pagination parameters
     * @return Page of matching brands
     */
    @Query("SELECT b FROM Brand b WHERE b.isActive = true AND " +
           "(LOWER(b.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Brand> searchActiveBrands(@Param("searchTerm") String searchTerm, Pageable pageable);

    /**
     * Finds brands by country of origin.
     *
     * @param country The country
     * @return List of brands from the country
     */
    List<Brand> findByCountryOfOrigin(String country);

    /**
     * Finds brands by country of origin with pagination.
     *
     * @param country The country
     * @param pageable Pagination parameters
     * @return Page of brands from the country
     */
    Page<Brand> findByCountryOfOrigin(String country, Pageable pageable);
}
