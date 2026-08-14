package com.cdac.application_management_system.repository;

import com.cdac.application_management_system.entity.Declaration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeclarationRepository extends JpaRepository<Declaration, Long> {
}
