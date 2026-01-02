package com.retrorise.notification;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.kafka.annotation.EnableKafka;

/**
 * Main application class for the Notification Service.
 * This service manages notifications in the RetroRise platform.
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableKafka
public class NotificationApplication {

    public static void main(String[] args) {
        SpringApplication.run(NotificationApplication.class, args);
    }
}
