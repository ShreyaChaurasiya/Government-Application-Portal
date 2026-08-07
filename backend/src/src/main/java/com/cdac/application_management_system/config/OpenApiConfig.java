package com.cdac.application_management_system.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI applicationManagementAPI() {

        return new OpenAPI()
                .info(new Info()
                        .title("Application Management System API")
                        .version("1.0")
                        .description("REST API for Application Management System")
                        .contact(new Contact()
                                .name("Abhinav Singh")
                                .email("abhinav@example.com")));
    }
}