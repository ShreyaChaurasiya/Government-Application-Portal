package com.cdac.application_management_system.dto.request;

import com.cdac.application_management_system.enums.OtpType;
import jakarta.validation.constraints.NotNull;

public class ResendOtpRequestDTO {

    @NotNull(message = "User id is required.")
    private Long userId;

    @NotNull(message = "OTP type is required.")
    private OtpType type;

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
}
