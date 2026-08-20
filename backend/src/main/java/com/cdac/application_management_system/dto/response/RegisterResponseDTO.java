package com.cdac.application_management_system.dto.response;

public class RegisterResponseDTO {

    private Long userId;
    private String message;
    private String emailOtp;
    private String phoneOtp;

    public RegisterResponseDTO(Long userId, String message, String emailOtp, String phoneOtp) {
        this.userId = userId;
        this.message = message;
        this.emailOtp = emailOtp;
        this.phoneOtp = phoneOtp;
    }

    public Long getUserId() {
        return userId;
    }

    public String getMessage() {
        return message;
    }

    public String getEmailOtp() {
        return emailOtp;
    }

    public String getPhoneOtp() {
        return phoneOtp;
    }
}
