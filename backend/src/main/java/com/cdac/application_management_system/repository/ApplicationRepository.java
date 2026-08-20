package com.cdac.application_management_system.repository;

import com.cdac.application_management_system.entity.Application;
import com.cdac.application_management_system.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByApplicantId(Long applicantId);

    List<Application> findByStatusNot(ApplicationStatus status);
}