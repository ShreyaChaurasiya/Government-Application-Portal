package com.cdac.application_management_system.service;

import com.cdac.application_management_system.dto.request.LoginRequestDTO;
import com.cdac.application_management_system.dto.request.RegisterRequestDTO;
import com.cdac.application_management_system.dto.response.AuthResponseDTO;

public interface AuthService {

    AuthResponseDTO register(RegisterRequestDTO request);

    AuthResponseDTO login(LoginRequestDTO request);
}
