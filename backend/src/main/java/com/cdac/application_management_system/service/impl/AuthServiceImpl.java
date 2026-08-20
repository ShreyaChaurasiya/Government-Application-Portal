package com.cdac.application_management_system.service.impl;

import com.cdac.application_management_system.dto.request.*;
import com.cdac.application_management_system.dto.response.AuthResponseDTO;
import com.cdac.application_management_system.dto.response.CaptchaResponseDTO;
import com.cdac.application_management_system.dto.response.RegisterResponseDTO;
import com.cdac.application_management_system.entity.PortalUser;
import com.cdac.application_management_system.entity.RefreshToken;
import com.cdac.application_management_system.enums.OtpType;
import com.cdac.application_management_system.enums.UserRole;
import com.cdac.application_management_system.repository.PortalUserRepository;
import com.cdac.application_management_system.repository.RefreshTokenRepository;
import com.cdac.application_management_system.security.JwtUtil;
import com.cdac.application_management_system.service.AuditService;
import com.cdac.application_management_system.service.AuthService;
import com.cdac.application_management_system.service.CaptchaService;
import com.cdac.application_management_system.service.OtpService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private static final long REFRESH_TOKEN_VALIDITY_DAYS = 1;

    private final PortalUserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CaptchaService captchaService;
    private final OtpService otpService;
    private final AuditService auditService;

    public AuthServiceImpl(
            PortalUserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            CaptchaService captchaService,
            OtpService otpService,
            AuditService auditService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.captchaService = captchaService;
        this.otpService = otpService;
        this.auditService = auditService;
    }

    @Override
    public CaptchaResponseDTO getCaptcha() {
        return captchaService.generate();
    }

    @Override
    public RegisterResponseDTO register(RegisterRequestDTO request) {
        log.info("Registration attempt for email={}", request.getEmail());
        captchaService.validate(request.getCaptchaId(), request.getCaptchaAnswer());

        String email = normalizeEmail(request.getEmail());
        String phone = request.getPhoneNumber().trim();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            log.warn("Registration rejected — email already exists: {}", email);
            throw new RuntimeException("Email already registered. Please sign in.");
        }
        if (userRepository.existsByPhoneNumber(phone)) {
            log.warn("Registration rejected — phone already exists: {}", phone);
            throw new RuntimeException("Phone number already registered.");
        }
        if (!isPasswordStrong(request.getPassword())) {
            throw new RuntimeException("Password must be at least 8 characters with letters and numbers.");
        }

        PortalUser user = new PortalUser();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPhoneNumber(phone);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setCompanyName(normalizeOptionalText(request.getCompanyName()));
        user.setRole(UserRole.APPLICANT);
        user.setEmailVerified(Boolean.FALSE);
        user.setPhoneVerified(Boolean.FALSE);
        user.setVerified(Boolean.FALSE);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiresAt(null);

        PortalUser saved = userRepository.save(user);

        String emailOtp = otpService.issueOtp(saved, OtpType.EMAIL);
        String phoneOtp = otpService.issueOtp(saved, OtpType.PHONE);

        auditService.log(saved.getId(), "USER_REGISTERED", "Applicant account created");
        log.info("User registered successfully userId={} email={}", saved.getId(), email);

        return new RegisterResponseDTO(
                saved.getId(),
                "Account created. Verify your email and phone with the OTP codes sent.",
                emailOtp,
                phoneOtp
        );
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO request) {
        String email = normalizeEmail(request.getEmail());
        log.info("Login attempt for email={}", email);
        captchaService.validate(request.getCaptchaId(), request.getCaptchaAnswer());

        PortalUser user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> {
                    log.warn("Login failed — unknown email: {}", email);
                    return new RuntimeException("Incorrect email or password.");
                });

        if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(LocalDateTime.now())) {
            log.warn("Login blocked — account locked userId={}", user.getId());
            throw new RuntimeException("Account is locked. Try again later.");
        }

        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            log.warn("Login blocked — email not verified userId={}", user.getId());
            throw new RuntimeException("Verify your email OTP before signing in.");
        }
        if (!Boolean.TRUE.equals(user.getPhoneVerified())) {
            log.warn("Login blocked — phone not verified userId={}", user.getId());
            throw new RuntimeException("Verify your phone OTP before signing in.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            int failed = (user.getFailedLoginAttempts() == null ? 0 : user.getFailedLoginAttempts()) + 1;
            user.setFailedLoginAttempts(failed);
            if (failed >= 5) {
                user.setLockedUntil(LocalDateTime.now().plusMinutes(15));
                log.warn("Account locked after {} failed attempts userId={}", failed, user.getId());
            }
            userRepository.save(user);
            log.warn("Login failed — incorrect password userId={} attempts={}", user.getId(), failed);
            throw new RuntimeException("Incorrect email or password.");
        }

        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        userRepository.save(user);

        auditService.log(user.getId(), "USER_LOGIN", "Successful login");
        log.info("Login successful userId={} role={}", user.getId(), user.getRole());
        return toAuthResponse(user);
    }

    @Override
    public void verifyOtp(VerifyOtpRequestDTO request) {
        log.info("OTP verification userId={} type={}", request.getUserId(), request.getType());
        otpService.verifyOtp(request.getUserId(), request.getType(), request.getCode());
        auditService.log(request.getUserId(), "OTP_VERIFIED", request.getType().name());
        log.info("OTP verified userId={} type={}", request.getUserId(), request.getType());
    }

    @Override
    public String resendOtp(ResendOtpRequestDTO request) {
        log.info("OTP resend requested userId={} type={}", request.getUserId(), request.getType());
        PortalUser user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found."));
        return otpService.issueOtp(user, request.getType());
    }

    @Override
    public void forgotPassword(ForgotPasswordRequestDTO request) {
        log.info("Password reset requested for email={}", request.getEmail());
        captchaService.validate(request.getCaptchaId(), request.getCaptchaAnswer());

        PortalUser user = userRepository.findByEmailIgnoreCase(normalizeEmail(request.getEmail()))
                .orElseThrow(() -> new RuntimeException("No account found for this email."));

        otpService.issueOtp(user, OtpType.PASSWORD_RESET);
        auditService.log(user.getId(), "PASSWORD_RESET_REQUESTED", "OTP issued");
        log.info("Password reset OTP issued userId={}", user.getId());
    }

    @Override
    public void resetPassword(ResetPasswordRequestDTO request) {
        log.info("Password reset attempt for email={}", request.getEmail());
        PortalUser user = userRepository.findByEmailIgnoreCase(normalizeEmail(request.getEmail()))
                .orElseThrow(() -> new RuntimeException("No account found for this email."));

        if (!isPasswordStrong(request.getNewPassword())) {
            throw new RuntimeException("Password must be at least 8 characters with letters and numbers.");
        }

        otpService.verifyOtp(user.getId(), OtpType.PASSWORD_RESET, request.getCode());

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        userRepository.save(user);

        auditService.log(user.getId(), "PASSWORD_RESET", "Password updated");
        log.info("Password reset successful userId={}", user.getId());
    }

    @Override
    public void verifyEmail(String token) {
        log.info("Email link verification attempt");
        PortalUser user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token."));

        if (user.getVerificationTokenExpiresAt() == null
                || user.getVerificationTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification link has expired.");
        }

        user.setEmailVerified(Boolean.TRUE);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiresAt(null);
        user.setVerified(Boolean.TRUE.equals(user.getEmailVerified()) && Boolean.TRUE.equals(user.getPhoneVerified()));
        userRepository.save(user);
        log.info("Email verified via link userId={}", user.getId());
    }

    @Override
    public AuthResponseDTO refresh(String refreshTokenValue) {
        log.debug("Token refresh requested");
        RefreshToken existing = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token."));

        if (Boolean.TRUE.equals(existing.getRevoked()) || existing.getExpiresAt().isBefore(LocalDateTime.now())) {
            log.warn("Refresh token expired or revoked");
            throw new RuntimeException("Refresh token expired. Please log in again.");
        }

        existing.setRevoked(true);
        refreshTokenRepository.save(existing);
        log.info("Token refreshed userId={}", existing.getUser().getId());
        return toAuthResponse(existing.getUser());
    }

    @Override
    public void logout(String refreshTokenValue) {
        refreshTokenRepository.findByToken(refreshTokenValue)
                .ifPresent(rt -> {
                    rt.setRevoked(true);
                    refreshTokenRepository.save(rt);
                    log.info("User logged out userId={}", rt.getUser().getId());
                });
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
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private boolean isPasswordStrong(String password) {
        if (password == null || password.length() < 8) return false;
        boolean hasLetter = password.chars().anyMatch(Character::isLetter);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        return hasLetter && hasDigit;
    }
}
