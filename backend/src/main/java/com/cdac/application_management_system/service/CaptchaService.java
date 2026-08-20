package com.cdac.application_management_system.service;

import com.cdac.application_management_system.dto.response.CaptchaResponseDTO;

public interface CaptchaService {

    CaptchaResponseDTO generate();

    void validate(String captchaId, String answer);
}
