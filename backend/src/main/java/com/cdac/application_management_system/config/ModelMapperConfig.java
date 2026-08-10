package com.cdac.application_management_system.config;

import com.cdac.application_management_system.dto.response.ApplicationResponseDTO;
import com.cdac.application_management_system.entity.Application;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {

        ModelMapper mapper = new ModelMapper();

        mapper.typeMap(Application.class, ApplicationResponseDTO.class)
                .addMappings(m -> m.map(
                        Application::getRemarks,
                        ApplicationResponseDTO::setReviewerRemarks
                ));

        return mapper;
    }
}