package com.cdac.application_management_system.dto.request;

import com.cdac.application_management_system.enums.OtpType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VerifyOtpRequestDTO {

    @NotNull(message = "User id is required.")
    private Long userId;

    @NotNull(message = "OTP type is required.")
    private OtpType type;

    @NotBlank(message = "OTP code is required.")
    private String code;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public OtpType getType() {
        return type;
    }

    public void setType(OtpType type) {
        this.type = type;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
