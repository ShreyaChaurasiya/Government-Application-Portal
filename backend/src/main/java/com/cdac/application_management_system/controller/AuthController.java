package com.cdac.application_management_system.controller;

import com.cdac.application_management_system.dto.request.*;
import com.cdac.application_management_system.dto.response.AuthResponseDTO;
import com.cdac.application_management_system.dto.response.CaptchaResponseDTO;
import com.cdac.application_management_system.dto.response.RegisterResponseDTO;
import com.cdac.application_management_system.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/captcha")
    public CaptchaResponseDTO captcha() {
        return authService.getCaptcha();
    }

    @PostMapping("/register")
    public RegisterResponseDTO register(@Valid @RequestBody RegisterRequestDTO request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@Valid @RequestBody LoginRequestDTO request) {
        return authService.login(request);
    }

    @PostMapping("/verify-otp")
    public Map<String, String> verifyOtp(@Valid @RequestBody VerifyOtpRequestDTO request) {
        authService.verifyOtp(request);
        return Map.of("message", "OTP verified successfully.");
    }

    @PostMapping("/resend-otp")
    public Map<String, String> resendOtp(@Valid @RequestBody ResendOtpRequestDTO request) {
        String devOtp = authService.resendOtp(request);
        if (devOtp != null) {
            return Map.of("message", "OTP resent.", "otp", devOtp);
        }
        return Map.of("message", "OTP resent to your registered contact.");
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDTO request) {
        authService.forgotPassword(request);
        return Map.of("message", "If the account exists, a reset OTP has been sent to your email.");
    }

    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@Valid @RequestBody ResetPasswordRequestDTO request) {
        authService.resetPassword(request);
        return Map.of("message", "Password updated. You can now sign in.");
    }

    @PostMapping("/refresh")
    public AuthResponseDTO refresh(@Valid @RequestBody RefreshRequestDTO request) {
        return authService.refresh(request.getRefreshToken());
    }

    @PostMapping("/logout")
    public void logout(@Valid @RequestBody RefreshRequestDTO request) {
        authService.logout(request.getRefreshToken());
    }

    @GetMapping("/verify")
    public Map<String, String> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return Map.of("message", "Email verified successfully. You can now log in.");
    }
}
