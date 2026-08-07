package com.cdac.application_management_system.service.impl;
import com.cdac.application_management_system.enums.ApplicationStatus;
import com.cdac.application_management_system.repository.ApplicationRepository;
import com.cdac.application_management_system.entity.Application;
import com.cdac.application_management_system.service.ApplicationService;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;
import com.cdac.application_management_system.dto.request.ApplicationRequestDTO;
import com.cdac.application_management_system.dto.response.ApplicationResponseDTO;
import java.util.List;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    public ApplicationServiceImpl(
            ApplicationRepository applicationRepository,
            ModelMapper modelMapper) {

        this.applicationRepository = applicationRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public ApplicationResponseDTO createApplication(ApplicationRequestDTO request) {

        Application application = modelMapper.map(request, Application.class);

        application.setStatus(ApplicationStatus.DRAFT);

        // Set Application reference in Personnel
        if (application.getPersonnel() != null) {
            application.getPersonnel().forEach(personnel ->
                    personnel.setApplication(application));
        }

        // Set Application reference in Declaration
        if (application.getDeclarations() != null) {
            application.getDeclarations().setApplication(application);
        }

        Application savedApplication = applicationRepository.save(application);

        return modelMapper.map(savedApplication, ApplicationResponseDTO.class);
    }

    @Override
    public ApplicationResponseDTO updateApplication(Long id, ApplicationRequestDTO request) {

        Application existingApplication = getApplicationEntityById(id);

        modelMapper.map(request, existingApplication);

        if (existingApplication.getPersonnel() != null) {
            existingApplication.getPersonnel().forEach(personnel ->
                    personnel.setApplication(existingApplication));
        }

        if (existingApplication.getDeclarations() != null) {
            existingApplication.getDeclarations().setApplication(existingApplication);
        }

        Application updatedApplication = applicationRepository.save(existingApplication);

        return modelMapper.map(updatedApplication, ApplicationResponseDTO.class);
    }
    @Override
    public ApplicationResponseDTO getApplicationById(Long id) {

        Application application = getApplicationEntityById(id);

        return modelMapper.map(application, ApplicationResponseDTO.class);
    }

    private Application getApplicationEntityById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    @Override
    public List<ApplicationResponseDTO> getAllApplications() {

        return applicationRepository.findAll()
                .stream()
                .map(application -> modelMapper.map(application, ApplicationResponseDTO.class))
                .toList();
    }

    @Override
    public ApplicationResponseDTO submitApplication(Long id) {

        Application application = getApplicationEntityById(id);

        if (application.getStatus() != ApplicationStatus.DRAFT) {
            throw new RuntimeException("Only draft applications can be submitted.");
        }

        application.setStatus(ApplicationStatus.SUBMITTED);

        Application updatedApplication = applicationRepository.save(application);

        return modelMapper.map(updatedApplication, ApplicationResponseDTO.class);
    }

    @Override
    public ApplicationResponseDTO approveApplication(Long id, String remarks) {

        Application application = getApplicationEntityById(id);

        if (application.getStatus() != ApplicationStatus.SUBMITTED) {
            throw new RuntimeException("Only submitted applications can be approved.");
        }

        application.setStatus(ApplicationStatus.APPROVED);
        application.setRemarks(remarks);

        Application updatedApplication = applicationRepository.save(application);

        return modelMapper.map(updatedApplication, ApplicationResponseDTO.class);
    }

    @Override
    public ApplicationResponseDTO rejectApplication(Long id, String remarks) {

        Application application = getApplicationEntityById(id);

        if (application.getStatus() != ApplicationStatus.SUBMITTED) {
            throw new RuntimeException("Only submitted applications can be rejected.");
        }

        application.setStatus(ApplicationStatus.REJECTED);
        application.setRemarks(remarks);

        Application updatedApplication = applicationRepository.save(application);

        return modelMapper.map(updatedApplication, ApplicationResponseDTO.class);
    }

    @Override
    public void deleteApplication(Long id) {
        Application existingApplication = getApplicationEntityById(id);
        applicationRepository.delete(existingApplication);

    }
    private final ApplicationRepository applicationRepository;
    private final ModelMapper modelMapper;}