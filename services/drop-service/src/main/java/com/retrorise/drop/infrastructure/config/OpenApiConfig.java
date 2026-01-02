package com.retrorise.drop.infrastructure.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI configuration for the Drop Service.
 */
@Configuration
public class OpenApiConfig {

    @Value("${server.port:8082}")
    private int serverPort;

    @Bean
    public OpenAPI dropServiceOpenAPI() {
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
                                        .description("JWT token from Keycloak")
                        )
                )
                .info(new Info()
                        .title("Drop Service API")
                        .description("API for managing drops in the RetroRise platform")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("RetroRise Team")
                                .email("contact@retrorise.com")
                        )
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")
                        )
                )
                .servers(List.of(
                        new Server().url("http://localhost:" + serverPort).description("Local server"),
                        new Server().url("https://api.retrorise.com/drops").description("Production server")
                ));
    }
}
