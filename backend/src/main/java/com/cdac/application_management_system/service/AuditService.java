package com.cdac.application_management_system.service;

public interface AuditService {

    void log(Long userId, String action, String details);
}
