package com.cdac.application_management_system.service.impl;

import com.cdac.application_management_system.dto.request.LoginRequestDTO;
import com.cdac.application_management_system.dto.request.RegisterRequestDTO;
import com.cdac.application_management_system.dto.response.AuthResponseDTO;
import com.cdac.application_management_system.entity.PortalUser;
import com.cdac.application_management_system.entity.RefreshToken;
import com.cdac.application_management_system.repository.PortalUserRepository;
import com.cdac.application_management_system.repository.RefreshTokenRepository;
import com.cdac.application_management_system.security.JwtUtil;
import com.cdac.application_management_system.service.AuthService;
import com.cdac.application_management_system.service.EmailService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private static final long REFRESH_TOKEN_VALIDITY_DAYS = 1;

    private final PortalUserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public AuthServiceImpl(
            PortalUserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            EmailService emailService) {

        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    @Override
    public void register(RegisterRequestDTO request) {
        String email = normalizeEmail(request.getEmail());

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new RuntimeException("Email already exists. Please sign in.");
        }

        // Password strength check
        if (!isPasswordStrong(request.getPassword())) {
            throw new RuntimeException("Password does not meet strength requirements. Use at least 8 characters, including letters and numbers.");
        }

        PortalUser user = new PortalUser();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setCompanyName(normalizeOptionalText(request.getCompanyName()));
        user.setRole(request.getRole() == null ? com.cdac.application_management_system.enums.UserRole.APPLICANT : request.getRole());

        String verificationToken = UUID.randomUUID().toString();

        user.setVerificationToken(verificationToken);
        user.setVerificationTokenExpiresAt(
                LocalDateTime.now().plusHours(24)
        );
        user.setVerified(Boolean.FALSE);

        PortalUser savedUser = userRepository.save(user);

        // Send verification email
        emailService.sendVerificationEmail(savedUser, verificationToken);
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO request) {
        PortalUser user = userRepository.findByEmailIgnoreCase(normalizeEmail(request.getEmail()))
                .orElseThrow(() -> new RuntimeException("Incorrect email or password."));

        // Check account lock
        if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Account is locked. Try again later.");


        }
        if (!Boolean.TRUE.equals(user.getVerified())) {
            throw new RuntimeException(
                    "Please verify your email before signing in."
            );
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            // increment failed attempts
            int failed = (user.getFailedLoginAttempts() == null ? 0 : user.getFailedLoginAttempts()) + 1;
            user.setFailedLoginAttempts(failed);
            if (failed >= 5) {
                user.setLockedUntil(LocalDateTime.now().plusMinutes(15));
            }
            userRepository.save(user);
            throw new RuntimeException("Incorrect email or password.");
        }

        // success: reset counters
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        userRepository.save(user);

        return toAuthResponse(user);
    }

    @Override
    public AuthResponseDTO refresh(String refreshTokenValue) {
        RefreshToken existing = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token."));

        if (Boolean.TRUE.equals(existing.getRevoked()) || existing.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Refresh token expired or revoked. Please log in again.");
        }

        // Rotate: kill the used token so it can never be replayed, then issue a fresh pair.
        existing.setRevoked(true);
        refreshTokenRepository.save(existing);

        return toAuthResponse(existing.getUser());
    }

    @Override
    public void logout(String refreshTokenValue) {
        refreshTokenRepository.findByToken(refreshTokenValue)
                .ifPresent(rt -> {
                    rt.setRevoked(true);
                    refreshTokenRepository.save(rt);
                });
        // No matching token is not an error - logout is idempotent from the client's perspective.
    }

    private AuthResponseDTO toAuthResponse(PortalUser user) {
        String accessToken = jwtUtil.generateToken(user);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setUser(user);
        refreshToken.setExpiresAt(LocalDateTime.now().plusDays(REFRESH_TOKEN_VALIDITY_DAYS));
        refreshTokenRepository.save(refreshToken);

        return new AuthResponseDTO(accessToken, refreshToken.getToken(), user.getName(), user.getEmail(), user.getRole());
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private String normalizeOptionalText(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private boolean isPasswordStrong(String password) {
        if (password == null) return false;
        if (password.length() < 8) return false;
        boolean hasLetter = password.chars().anyMatch(Character::isLetter);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        return hasLetter && hasDigit;
    }

    @Override
    public void verifyEmail(String token) {

        PortalUser user = userRepository.findByVerificationToken(token)
                .orElseThrow(() ->
                        new RuntimeException("Invalid verification token.")
                );

        if (user.getVerificationTokenExpiresAt() == null ||
                user.getVerificationTokenExpiresAt()
                        .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "Verification link has expired. Please request a new verification email."
            );
        }

        user.setVerified(Boolean.TRUE);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiresAt(null);

        userRepository.save(user);
    }
}