package com.cdac.application_management_system.dto.response;

import com.cdac.application_management_system.enums.UserRole;

public class AuthResponseDTO {

    private String token;
    private String refreshToken;
    private String name;
    private String email;
    private UserRole role;

    public AuthResponseDTO(String token, String refreshToken, String name, String email, UserRole role) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public UserRole getRole() {
        return role;
    }
}