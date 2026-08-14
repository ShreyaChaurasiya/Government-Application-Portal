package com.cdac.application_management_system.service.impl;
import com.cdac.application_management_system.enums.ApplicationStatus;
import com.cdac.application_management_system.repository.ApplicationRepository;
import com.cdac.application_management_system.entity.Application;
import com.cdac.application_management_system.service.ApplicationService;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;
import com.cdac.application_management_system.dto.request.ApplicationRequestDTO;
import com.cdac.application_management_system.dto.response.ApplicationResponseDTO;
import com.cdac.application_management_system.dto.response.ApplicationResponseDTO;
import com.cdac.application_management_system.entity.Personnel;
import com.cdac.application_management_system.entity.Declaration;
import java.util.List;
import java.util.ArrayList;

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

        application.setPersonnel(new ArrayList<>());
        if (request.getPersonnel() != null) {
            request.getPersonnel().forEach(personnelRequest -> {
                Personnel personnel = modelMapper.map(personnelRequest, Personnel.class);
                personnel.setApplication(application);
                application.getPersonnel().add(personnel);
            });
        }

        if (request.getDeclarations() != null) {
            Declaration declaration = modelMapper.map(request.getDeclarations(), Declaration.class);
            declaration.setApplication(application);
            application.setDeclarations(declaration);
        } else {
            application.setDeclarations(null);
        }

        Application savedApplication = applicationRepository.save(application);

        return modelMapper.map(savedApplication, ApplicationResponseDTO.class);
    }

    @Override
    public ApplicationResponseDTO updateApplication(Long id, ApplicationRequestDTO request) {

        Application existingApplication = getApplicationEntityById(id);

        applyRequest(existingApplication, request);

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
    public ApplicationResponseDTO submitApplication(Long id, ApplicationRequestDTO request) {

        Application application = getApplicationEntityById(id);

        if (application.getStatus() != ApplicationStatus.DRAFT) {
            throw new RuntimeException("Only draft applications can be submitted.");
        }

        if (request != null) {
            applyRequest(application, request);
        }

        validateForSubmission(application);

        application.setStatus(ApplicationStatus.SUBMITTED);

        Application updatedApplication = applicationRepository.save(application);

        return modelMapper.map(updatedApplication, ApplicationResponseDTO.class);
    }

    private void applyRequest(Application application, ApplicationRequestDTO request) {
        application.setCompanyName(request.getCompanyName());
        application.setAddress(request.getAddress());
        application.setCountry(request.getCountry());
        application.setProjectDescription(request.getProjectDescription());
        application.setEmail(request.getEmail());
        application.setPlaceOfStay(request.getPlaceOfStay());
        application.setPhoneNumber(request.getPhoneNumber());
        application.setSelfDeclaration(Boolean.TRUE.equals(request.getSelfDeclaration()));

        application.getPersonnel().clear();
        if (request.getPersonnel() != null) {
            request.getPersonnel().forEach(personnelRequest -> {
                Personnel personnel = modelMapper.map(personnelRequest, Personnel.class);
                personnel.setApplication(application);
                application.getPersonnel().add(personnel);
            });
        }

        if (request.getDeclarations() != null) {
            Declaration declaration = modelMapper.map(request.getDeclarations(), Declaration.class);
            declaration.setApplication(application);
            application.setDeclarations(declaration);
        } else {
            application.setDeclarations(null);
        }
    }

    private void validateForSubmission(Application application) {
        if (application.getCompanyName() == null || application.getCompanyName().isBlank()) {
            throw new RuntimeException("Company name is required.");
        }

        if (application.getAddress() == null || application.getAddress().isBlank()) {
            throw new RuntimeException("Address is required.");
        }

        if (application.getCountry() == null || application.getCountry().isBlank()) {
            throw new RuntimeException("Country is required.");
        }

        if (application.getProjectDescription() == null || application.getProjectDescription().isBlank()) {
            throw new RuntimeException("Project description is required.");
        }

        if (application.getEmail() == null || application.getEmail().isBlank()) {
            throw new RuntimeException("Email is required.");
        }

        if (application.getPlaceOfStay() == null || application.getPlaceOfStay().isBlank()) {
            throw new RuntimeException("Place of stay is required.");
        }

        if (application.getPhoneNumber() == null || !application.getPhoneNumber().matches("^[0-9]{10}$")) {
            throw new RuntimeException("Phone number must contain exactly 10 digits.");
        }

        if (application.getPersonnel() == null || application.getPersonnel().isEmpty()) {
            throw new RuntimeException("Add at least one key personnel entry.");
        }

        if (application.getDeclarations() == null
                || application.getDeclarations().getCompliesLaws() == null
                || application.getDeclarations().getHasInsurance() == null) {
            throw new RuntimeException("Declarations are required.");
        }

        if (!application.isSelfDeclaration()) {
            throw new RuntimeException("Self declaration must be accepted.");
        }
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
