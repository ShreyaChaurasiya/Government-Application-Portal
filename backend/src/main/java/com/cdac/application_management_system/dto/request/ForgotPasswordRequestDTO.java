package com.cdac.application_management_system.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ForgotPasswordRequestDTO {

    @Email(message = "Enter a valid email address.")
    @NotBlank(message = "Email is required.")
    private String email;

    @NotBlank(message = "Captcha id is required.")
    private String captchaId;

    @NotBlank(message = "Captcha answer is required.")
    private String captchaAnswer;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCaptchaId() {
        return captchaId;
    }

    public void setCaptchaId(String captchaId) {
        this.captchaId = captchaId;
    }

    public String getCaptchaAnswer() {
        return captchaAnswer;
    }

    public void setCaptchaAnswer(String captchaAnswer) {
        this.captchaAnswer = captchaAnswer;
    }
}
