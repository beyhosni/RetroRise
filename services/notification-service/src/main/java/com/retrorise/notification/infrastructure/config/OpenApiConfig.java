package com.retrorise.notification.infrastructure.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI configuration for the Notification Service.
 */
@Configuration
public class OpenApiConfig {

    @Value("${keycloak.auth-server-url}")
    private String authServerUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Bean
    public OpenAPI notificationServiceOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("JWT token obtained from Keycloak"))
                        .addSchemas("NotificationType", createNotificationTypeSchema())
                        .addSchemas("NotificationStatus", createNotificationStatusSchema()))
                .info(new Info()
                        .title("Notification Service API")
                        .description("API for managing notifications in the RetroRise platform")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("RetroRise Team")
                                .email("contact@retrorise.com")
                                .url("https://retrorise.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server().url("http://localhost:8084").description("Local development server"),
                        new Server().url("https://api.retrorise.com").description("Production server")));
    }

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("notification-service-public")
                .pathsToMatch("/api/v1/notifications/**")
                .build();
    }

    @Bean
    public GroupedOpenApi actuatorApi() {
        return GroupedOpenApi.builder()
                .group("actuator")
                .pathsToMatch("/actuator/**")
                .build();
    }

    /**
     * Creates the schema for NotificationType enum.
     *
     * @return The NotificationType schema
     */
    private Schema<?> createNotificationTypeSchema() {
        Schema<?> schema = new Schema<>();
        schema.setType("string");
        schema.setEnum(List.of(
                "ORDER_CONFIRMATION",
                "ORDER_SHIPPED",
                "ORDER_DELIVERED",
                "ORDER_CANCELLED",
                "ORDER_REFUNDED",
                "DROP_ANNOUNCEMENT",
                "DROP_EARLY_ACCESS",
                "DROP_LIVE",
                "DROP_ENDING_SOON",
                "STOCK_ALERT",
                "DELIVERY_UPDATE",
                "PROMOTION",
                "SYSTEM"
        ));
        schema.setDescription("Type of notification");
        return schema;
    }

    /**
     * Creates the schema for NotificationStatus enum.
     *
     * @return The NotificationStatus schema
     */
    private Schema<?> createNotificationStatusSchema() {
        Schema<?> schema = new Schema<>();
        schema.setType("string");
        schema.setEnum(List.of(
                "PENDING",
                "SENT",
                "READ",
                "FAILED"
        ));
        schema.setDescription("Status of notification");
        return schema;
    }
}
