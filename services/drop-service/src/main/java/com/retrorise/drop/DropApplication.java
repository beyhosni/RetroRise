package com.retrorise.drop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main application class for the Drop Service.
 * This service manages drops in the RetroRise platform.
 */
@SpringBootApplication
@EnableJpaAuditing
public class DropApplication {

    public static void main(String[] args) {
        SpringApplication.run(DropApplication.class, args);
    }
}
