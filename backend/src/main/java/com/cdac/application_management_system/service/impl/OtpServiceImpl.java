package com.cdac.application_management_system.service.impl;

import com.cdac.application_management_system.entity.OtpRecord;
import com.cdac.application_management_system.entity.PortalUser;
import com.cdac.application_management_system.enums.OtpType;
import com.cdac.application_management_system.repository.OtpRecordRepository;
import com.cdac.application_management_system.repository.PortalUserRepository;
import com.cdac.application_management_system.service.EmailService;
import com.cdac.application_management_system.service.OtpService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class OtpServiceImpl implements OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpServiceImpl.class);

    private final OtpRecordRepository otpRecordRepository;
    private final PortalUserRepository userRepository;
    private final EmailService emailService;
    private final int expiryMinutes;
    private final boolean devShowOtp;

    public OtpServiceImpl(
            OtpRecordRepository otpRecordRepository,
            PortalUserRepository userRepository,
            EmailService emailService,
            @Value("${app.otp-expiry-minutes:10}") int expiryMinutes,
            @Value("${app.dev-show-otp:false}") boolean devShowOtp) {
        this.otpRecordRepository = otpRecordRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.expiryMinutes = expiryMinutes;
        this.devShowOtp = devShowOtp;
    }

    @Override
    public String issueOtp(PortalUser user, OtpType type) {
        String code = String.format("%06d", ThreadLocalRandom.current().nextInt(0, 1_000_000));

        OtpRecord record = new OtpRecord();
        record.setUserId(user.getId());
        record.setType(type);
        record.setCode(code);
        record.setExpiresAt(LocalDateTime.now().plusMinutes(expiryMinutes));
        record.setUsed(false);
        otpRecordRepository.save(record);

        if (type == OtpType.EMAIL || type == OtpType.PASSWORD_RESET) {
            emailService.sendOtpEmail(user, code, type);
        } else if (type == OtpType.PHONE) {
            log.info("SMS OTP issued for phone={} userId={} (check logs — dev mode)", user.getPhoneNumber(), user.getId());
            if (devShowOtp) {
                log.debug("Phone OTP code for userId={}: {}", user.getId(), code);
            }
        }

        log.info("OTP issued userId={} type={} expiresInMinutes={}", user.getId(), type, expiryMinutes);
        if (devShowOtp && type != OtpType.PHONE) {
            log.debug("OTP code for userId={} type={}: {}", user.getId(), type, code);
        }

        return devShowOtp ? code : null;
    }

    @Override
    public void verifyOtp(Long userId, OtpType type, String code) {
        log.debug("Verifying OTP userId={} type={}", userId, type);
        OtpRecord record = otpRecordRepository
                .findTopByUserIdAndTypeAndUsedFalseOrderByExpiresAtDesc(userId, type)
                .orElseThrow(() -> {
                    log.warn("OTP not found userId={} type={}", userId, type);
                    return new RuntimeException("OTP not found. Request a new code.");
                });

        if (record.getExpiresAt().isBefore(LocalDateTime.now())) {
            log.warn("OTP expired userId={} type={}", userId, type);
            throw new RuntimeException("OTP expired. Request a new code.");
        }

        if (!record.getCode().equals(code.trim())) {
            log.warn("Incorrect OTP userId={} type={}", userId, type);
            throw new RuntimeException("Incorrect OTP code.");
        }

        record.setUsed(true);
        otpRecordRepository.save(record);

        if (type == OtpType.PASSWORD_RESET) {
            return;
        }

        PortalUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (type == OtpType.EMAIL || type == OtpType.PASSWORD_RESET) {
            user.setEmailVerified(Boolean.TRUE);
        } else if (type == OtpType.PHONE) {
            user.setPhoneVerified(Boolean.TRUE);
        }

        user.setVerified(isFullyVerified(user));
        userRepository.save(user);
        log.info("OTP verified and user updated userId={} type={} emailVerified={} phoneVerified={}",
                userId, type, user.getEmailVerified(), user.getPhoneVerified());
    }

    private boolean isFullyVerified(PortalUser user) {
        return Boolean.TRUE.equals(user.getEmailVerified()) && Boolean.TRUE.equals(user.getPhoneVerified());
    }
}
