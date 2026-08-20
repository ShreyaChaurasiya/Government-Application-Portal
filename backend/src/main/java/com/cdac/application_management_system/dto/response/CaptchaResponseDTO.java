package com.cdac.application_management_system.dto.response;

public class CaptchaResponseDTO {

    private String captchaId;
    private String question;

    public CaptchaResponseDTO(String captchaId, String question) {
        this.captchaId = captchaId;
        this.question = question;
    }

    public String getCaptchaId() {
        return captchaId;
    }

    public String getQuestion() {
        return question;
    }
}
