package com.cdac.application_management_system.config;

import com.cdac.application_management_system.dto.response.ApplicationResponseDTO;
import com.cdac.application_management_system.dto.response.PersonnelResponseDTO;
import com.cdac.application_management_system.entity.Application;
import com.cdac.application_management_system.entity.Personnel;
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

        mapper.typeMap(Personnel.class, PersonnelResponseDTO.class)
                .addMappings(m -> m.map(
                        src -> src.getDateOfBirth() != null ? src.getDateOfBirth().toString() : null,
                        PersonnelResponseDTO::setDob
                ));

        return mapper;
    }
}