package com.cdac.application_management_system.service;

import com.cdac.application_management_system.dto.request.*;
import com.cdac.application_management_system.dto.response.AuthResponseDTO;
import com.cdac.application_management_system.dto.response.CaptchaResponseDTO;
import com.cdac.application_management_system.dto.response.RegisterResponseDTO;

public interface AuthService {

    CaptchaResponseDTO getCaptcha();

    RegisterResponseDTO register(RegisterRequestDTO request);

    AuthResponseDTO login(LoginRequestDTO request);

    void verifyEmail(String token);

    void verifyOtp(VerifyOtpRequestDTO request);

    String resendOtp(ResendOtpRequestDTO request);

    void forgotPassword(ForgotPasswordRequestDTO request);

    void resetPassword(ResetPasswordRequestDTO request);

    AuthResponseDTO refresh(String refreshTokenValue);

    void logout(String refreshTokenValue);
}
