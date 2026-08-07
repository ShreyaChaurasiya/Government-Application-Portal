package com.cdac.application_management_system.controller;

import com.cdac.application_management_system.dto.request.ApplicationRequestDTO;
import com.cdac.application_management_system.dto.response.ApplicationResponseDTO;
import com.cdac.application_management_system.service.ApplicationService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // CREATE
    @PostMapping
    public ApplicationResponseDTO createApplication(
            @Valid @RequestBody ApplicationRequestDTO request) {

        return applicationService.createApplication(request);
    }

    @GetMapping
    public List<ApplicationResponseDTO> getAllApplications() {
        return applicationService.getAllApplications();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ApplicationResponseDTO getApplicationById(@PathVariable Long id) {
        return applicationService.getApplicationById(id);
    }

    @PutMapping("/{id}")
    public ApplicationResponseDTO updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationRequestDTO request) {

        return applicationService.updateApplication(id, request);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
    }

    @PostMapping("/{id}/submit")
    public ApplicationResponseDTO submitApplication(@PathVariable Long id) {
        return applicationService.submitApplication(id);
    }

    @PostMapping("/{id}/approve")
    public ApplicationResponseDTO approveApplication(
            @PathVariable Long id,
            @RequestParam String remarks) {

        return applicationService.approveApplication(id, remarks);
    }

    @PostMapping("/{id}/reject")
    public ApplicationResponseDTO rejectApplication(
            @PathVariable Long id,
            @RequestParam String remarks) {

        return applicationService.rejectApplication(id, remarks);
    }
}