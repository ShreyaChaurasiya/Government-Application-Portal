package com.cdac.application_management_system.repository;

import com.cdac.application_management_system.entity.Personnel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonnelRepository extends JpaRepository<Personnel, Long> {

}