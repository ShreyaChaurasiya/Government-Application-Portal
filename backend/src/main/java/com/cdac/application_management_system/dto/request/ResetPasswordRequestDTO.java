package com.cdac.application_management_system.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResetPasswordRequestDTO {

    @Email(message = "Enter a valid email address.")
    @NotBlank(message = "Email is required.")
    private String email;

    @NotBlank(message = "OTP code is required.")
    private String code;

    @NotBlank(message = "Password is required.")
    @Size(min = 8, message = "Password must be at least 8 characters.")
    private String newPassword;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
