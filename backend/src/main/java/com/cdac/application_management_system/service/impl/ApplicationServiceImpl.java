package com.cdac.application_management_system.service.impl;
import com.cdac.application_management_system.enums.ApplicationStatus;
import com.cdac.application_management_system.enums.UserRole;
import com.cdac.application_management_system.repository.ApplicationRepository;
import com.cdac.application_management_system.entity.Application;
import com.cdac.application_management_system.entity.PortalUser;
import com.cdac.application_management_system.service.ApplicationService;
import com.cdac.application_management_system.service.AuditService;
import com.cdac.application_management_system.security.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;
import com.cdac.application_management_system.dto.request.ApplicationRequestDTO;
import com.cdac.application_management_system.dto.response.ApplicationResponseDTO;
import com.cdac.application_management_system.entity.Personnel;
import com.cdac.application_management_system.entity.Declaration;
import java.util.List;
import java.util.ArrayList;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    private static final Logger log = LoggerFactory.getLogger(ApplicationServiceImpl.class);

    private final ApplicationRepository applicationRepository;
    private final ModelMapper modelMapper;
    private final AuditService auditService;

    public ApplicationServiceImpl(
            ApplicationRepository applicationRepository,
            ModelMapper modelMapper,
            AuditService auditService) {
        this.applicationRepository = applicationRepository;
        this.modelMapper = modelMapper;
        this.auditService = auditService;
    }

    @Override
    public ApplicationResponseDTO createApplication(ApplicationRequestDTO request) {
        PortalUser currentUser = SecurityUtils.requireCurrentUser();
        if (SecurityUtils.isReviewer(currentUser)) {
            throw new RuntimeException("Reviewers cannot create applications.");
        }

        Application application = modelMapper.map(request, Application.class);
        application.setStatus(ApplicationStatus.DRAFT);
        application.setApplicantId(currentUser.getId());

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
        auditService.log(currentUser.getId(), "APPLICATION_CREATED", "Application id " + savedApplication.getId());
        log.info("Application created id={} applicantId={}", savedApplication.getId(), currentUser.getId());
        return modelMapper.map(savedApplication, ApplicationResponseDTO.class);
    }

    @Override
    public ApplicationResponseDTO updateApplication(Long id, ApplicationRequestDTO request) {
        Application existingApplication = getApplicationEntityForCurrentUser(id);
        ensureDraft(existingApplication);
        applyRequest(existingApplication, request);
        Application updatedApplication = applicationRepository.save(existingApplication);
        auditService.log(SecurityUtils.requireCurrentUser().getId(), "APPLICATION_UPDATED", "Application id " + id);
        log.info("Application updated id={}", id);
        return modelMapper.map(updatedApplication, ApplicationResponseDTO.class);
    }

    @Override
    public ApplicationResponseDTO getApplicationById(Long id) {
        Application application = getApplicationEntityForCurrentUser(id);
        return modelMapper.map(application, ApplicationResponseDTO.class);
    }

    @Override
    public List<ApplicationResponseDTO> getAllApplications() {
        PortalUser currentUser = SecurityUtils.requireCurrentUser();
        List<Application> applications;

        if (currentUser.getRole() == UserRole.REVIEWER) {
            applications = applicationRepository.findByStatusNot(ApplicationStatus.DRAFT);
        } else {
            applications = applicationRepository.findByApplicantId(currentUser.getId());
        }

        return applications.stream()
                .map(application -> modelMapper.map(application, ApplicationResponseDTO.class))
                .toList();
    }

    @Override
    public ApplicationResponseDTO submitApplication(Long id, ApplicationRequestDTO request) {
        Application application = getApplicationEntityForCurrentUser(id);
        ensureDraft(application);

        if (request != null) {
            applyRequest(application, request);
        }

        validateForSubmission(application);
        application.setStatus(ApplicationStatus.SUBMITTED);

        Application updatedApplication = applicationRepository.save(application);
        auditService.log(SecurityUtils.requireCurrentUser().getId(), "APPLICATION_SUBMITTED", "Application id " + id);
        log.info("Application submitted id={}", id);
        return modelMapper.map(updatedApplication, ApplicationResponseDTO.class);
    }

    @Override
    public ApplicationResponseDTO approveApplication(Long id, String remarks) {
        PortalUser reviewer = SecurityUtils.requireCurrentUser();
        if (!SecurityUtils.isReviewer(reviewer)) {
            throw new RuntimeException("Only reviewers can approve applications.");
        }

        Application application = getApplicationEntityById(id);
        if (application.getStatus() != ApplicationStatus.SUBMITTED) {
            throw new RuntimeException("Only submitted applications can be approved.");
        }

        application.setStatus(ApplicationStatus.APPROVED);
        application.setRemarks(remarks);
        Application updatedApplication = applicationRepository.save(application);
        auditService.log(reviewer.getId(), "APPLICATION_APPROVED", "Application id " + id);
        log.info("Application approved id={} by reviewerId={}", id, reviewer.getId());
        return modelMapper.map(updatedApplication, ApplicationResponseDTO.class);
    }

    @Override
    public ApplicationResponseDTO rejectApplication(Long id, String remarks) {
        PortalUser reviewer = SecurityUtils.requireCurrentUser();
        if (!SecurityUtils.isReviewer(reviewer)) {
            throw new RuntimeException("Only reviewers can reject applications.");
        }

        Application application = getApplicationEntityById(id);
        if (application.getStatus() != ApplicationStatus.SUBMITTED) {
            throw new RuntimeException("Only submitted applications can be rejected.");
        }

        application.setStatus(ApplicationStatus.REJECTED);
        application.setRemarks(remarks);
        Application updatedApplication = applicationRepository.save(application);
        auditService.log(reviewer.getId(), "APPLICATION_REJECTED", "Application id " + id);
        log.info("Application rejected id={} by reviewerId={}", id, reviewer.getId());
        return modelMapper.map(updatedApplication, ApplicationResponseDTO.class);
    }

    @Override
    public void deleteApplication(Long id) {
        Application application = getApplicationEntityForCurrentUser(id);
        ensureDraft(application);
        applicationRepository.delete(application);
        auditService.log(SecurityUtils.requireCurrentUser().getId(), "APPLICATION_DELETED", "Application id " + id);
        log.info("Application deleted id={}", id);
    }

    private Application getApplicationEntityById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Application not found id={}", id);
                    return new RuntimeException("Application not found");
                });
    }

    private Application getApplicationEntityForCurrentUser(Long id) {
        Application application = getApplicationEntityById(id);
        PortalUser currentUser = SecurityUtils.requireCurrentUser();

        if (SecurityUtils.isReviewer(currentUser)) {
            if (application.getStatus() == ApplicationStatus.DRAFT) {
                throw new RuntimeException("Reviewers cannot access draft applications.");
            }
            return application;
        }

        if (application.getApplicantId() == null || !application.getApplicantId().equals(currentUser.getId())) {
            log.warn("Access denied applicationId={} userId={}", id, currentUser.getId());
            throw new RuntimeException("You do not have permission to access this application.");
        }

        return application;
    }

    private void ensureDraft(Application application) {
        if (application.getStatus() != ApplicationStatus.DRAFT) {
            throw new RuntimeException("Only draft applications can be modified.");
        }
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
}
