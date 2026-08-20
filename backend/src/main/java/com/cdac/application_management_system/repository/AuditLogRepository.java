package com.cdac.application_management_system.repository;

import com.cdac.application_management_system.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}
