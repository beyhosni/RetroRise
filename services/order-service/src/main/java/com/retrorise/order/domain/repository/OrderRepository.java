package com.retrorise.order.domain.repository;

import com.retrorise.order.domain.model.Order;
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
 * Repository for Order entities.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    /**
     * Finds orders by customer ID.
     *
     * @param customerId The customer ID
     * @return List of orders for the customer
     */
    List<Order> findByCustomerId(String customerId);

    /**
     * Finds orders by customer ID with pagination.
     *
     * @param customerId The customer ID
     * @param pageable Pagination parameters
     * @return Page of orders for the customer
     */
    Page<Order> findByCustomerId(String customerId, Pageable pageable);

    /**
     * Finds orders by customer email.
     *
     * @param customerEmail The customer email
     * @return List of orders for the customer
     */
    List<Order> findByCustomerEmail(String customerEmail);

    /**
     * Finds orders by customer email with pagination.
     *
     * @param customerEmail The customer email
     * @param pageable Pagination parameters
     * @return Page of orders for the customer
     */
    Page<Order> findByCustomerEmail(String customerEmail, Pageable pageable);

    /**
     * Finds orders by drop ID.
     *
     * @param dropId The drop ID
     * @return List of orders for the drop
     */
    List<Order> findByDropId(String dropId);

    /**
     * Finds orders by drop ID with pagination.
     *
     * @param dropId The drop ID
     * @param pageable Pagination parameters
     * @return Page of orders for the drop
     */
    Page<Order> findByDropId(String dropId, Pageable pageable);

    /**
     * Finds orders by brand ID.
     *
     * @param brandId The brand ID
     * @return List of orders for the brand
     */
    List<Order> findByBrandId(String brandId);

    /**
     * Finds orders by brand ID with pagination.
     *
     * @param brandId The brand ID
     * @param pageable Pagination parameters
     * @return Page of orders for the brand
     */
    Page<Order> findByBrandId(String brandId, Pageable pageable);

    /**
     * Finds orders by status.
     *
     * @param status The order status
     * @return List of orders with the status
     */
    List<Order> findByStatus(Order.OrderStatus status);

    /**
     * Finds orders by status with pagination.
     *
     * @param status The order status
     * @param pageable Pagination parameters
     * @return Page of orders with the status
     */
    Page<Order> findByStatus(Order.OrderStatus status, Pageable pageable);

    /**
     * Finds orders by payment ID.
     *
     * @param paymentId The payment ID
     * @return Optional containing the order if found
     */
    Optional<Order> findByPaymentId(String paymentId);

    /**
     * Finds orders created within a date range.
     *
     * @param startDate Start of the date range
     * @param endDate End of the date range
     * @return List of orders created in the date range
     */
    @Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate")
    List<Order> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, 
                                        @Param("endDate") LocalDateTime endDate);

    /**
     * Finds orders created within a date range with pagination.
     *
     * @param startDate Start of the date range
     * @param endDate End of the date range
     * @param pageable Pagination parameters
     * @return Page of orders created in the date range
     */
    @Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate")
    Page<Order> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate, 
                                       Pageable pageable);

    /**
     * Counts orders by customer ID.
     *
     * @param customerId The customer ID
     * @return The number of orders for the customer
     */
    long countByCustomerId(String customerId);

    /**
     * Counts orders by drop ID.
     *
     * @param dropId The drop ID
     * @return The number of orders for the drop
     */
    long countByDropId(String dropId);

    /**
     * Counts orders by status.
     *
     * @param status The order status
     * @return The number of orders with the status
     */
    long countByStatus(Order.OrderStatus status);

    /**
     * Counts orders by customer ID and status.
     *
     * @param customerId The customer ID
     * @param status The order status
     * @return The number of orders for the customer with the status
     */
    long countByCustomerIdAndStatus(String customerId, Order.OrderStatus status);
}
