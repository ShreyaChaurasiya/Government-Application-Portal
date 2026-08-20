package com.cdac.application_management_system.service.impl;

import com.cdac.application_management_system.entity.AuditLog;
import com.cdac.application_management_system.repository.AuditLogRepository;
import com.cdac.application_management_system.service.AuditService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AuditServiceImpl implements AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditServiceImpl.class);

    private final AuditLogRepository auditLogRepository;

    public AuditServiceImpl(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    public void log(Long userId, String action, String details) {
        auditLogRepository.save(new AuditLog(userId, action, details));
        log.info("AUDIT userId={} action={} details={}", userId, action, details);
    }
}
