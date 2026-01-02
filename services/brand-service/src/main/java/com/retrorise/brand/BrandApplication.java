package com.retrorise.brand;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main application class for the Brand Service.
 * This service manages brands in the RetroRise platform.
 */
@SpringBootApplication
@EnableJpaAuditing
public class BrandApplication {

    public static void main(String[] args) {
        SpringApplication.run(BrandApplication.class, args);
    }
}
