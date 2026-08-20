package com.cdac.application_management_system.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequestDTO {

    @NotBlank(message = "Name is required.")
    private String name;

    @Email(message = "Enter a valid email address.")
    @NotBlank(message = "Email is required.")
    private String email;

    @NotBlank(message = "Phone number is required.")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits.")
    private String phoneNumber;

    @Size(min = 8, message = "Password must be at least 8 characters.")
    @NotBlank(message = "Password is required.")
    private String password;

    private String companyName;

    @NotBlank(message = "Captcha id is required.")
    private String captchaId;

    @NotBlank(message = "Captcha answer is required.")
    private String captchaAnswer;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
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
