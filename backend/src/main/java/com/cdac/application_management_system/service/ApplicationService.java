package com.cdac.application_management_system.service;

import com.cdac.application_management_system.dto.request.ApplicationRequestDTO;
import com.cdac.application_management_system.dto.response.ApplicationResponseDTO;

import java.util.List;

public interface ApplicationService {

    // CREATE
    ApplicationResponseDTO createApplication(ApplicationRequestDTO request);

    // GET BY ID
    ApplicationResponseDTO getApplicationById(Long id);

    // Remaining APIs (we'll convert next)
    List<ApplicationResponseDTO> getAllApplications();

    ApplicationResponseDTO updateApplication(Long id, ApplicationRequestDTO request);

    ApplicationResponseDTO submitApplication(Long id, ApplicationRequestDTO request);

    ApplicationResponseDTO approveApplication(Long id, String remarks);

    ApplicationResponseDTO rejectApplication(Long id, String remarks);

    void deleteApplication(Long id);
}
