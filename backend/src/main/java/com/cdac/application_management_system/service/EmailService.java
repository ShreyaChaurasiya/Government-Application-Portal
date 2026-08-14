package com.cdac.application_management_system.service;

import com.cdac.application_management_system.entity.PortalUser;

public interface EmailService {

    void sendVerificationEmail(
            PortalUser user,
            String verificationToken
    );
}