package com.cdac.application_management_system.service;

import com.cdac.application_management_system.entity.PortalUser;
import com.cdac.application_management_system.enums.OtpType;

public interface OtpService {

    String issueOtp(PortalUser user, OtpType type);

    void verifyOtp(Long userId, OtpType type, String code);
}
