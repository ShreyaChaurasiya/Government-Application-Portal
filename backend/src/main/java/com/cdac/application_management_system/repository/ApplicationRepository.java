package com.cdac.application_management_system.repository;

import com.cdac.application_management_system.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

}