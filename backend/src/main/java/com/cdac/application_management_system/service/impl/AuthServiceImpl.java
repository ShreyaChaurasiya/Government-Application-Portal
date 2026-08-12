package com.cdac.application_management_system.service.impl;

import com.cdac.application_management_system.dto.request.LoginRequestDTO;
import com.cdac.application_management_system.dto.request.RegisterRequestDTO;
import com.cdac.application_management_system.dto.response.AuthResponseDTO;
import com.cdac.application_management_system.entity.User;
import com.cdac.application_management_system.enums.UserRole;
import com.cdac.application_management_system.repository.UserRepository;
import com.cdac.application_management_system.service.AuthService;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AuthResponseDTO register(RegisterRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered. Please sign in instead.");
        }

        UserRole role;
        try {
            role = UserRole.valueOf(request.getRole());
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Choose a valid account type.");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setToken(UUID.randomUUID().toString());

        userRepository.save(user);
        return toResponse(user);
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Incorrect email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Incorrect email or password.");
        }

        user.setToken(UUID.randomUUID().toString());
        userRepository.save(user);
        return toResponse(user);
    }

    private AuthResponseDTO toResponse(User user) {
        return new AuthResponseDTO(
                user.getToken(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
