package com.cdac.application_management_system.service.impl;

import com.cdac.application_management_system.entity.PortalUser;
import com.cdac.application_management_system.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;
    private final String verificationUrl;
    private final boolean devSkipEmail;

    public EmailServiceImpl(
            JavaMailSender mailSender,
            @Value("${app.verification-url}") String verificationUrl,
            @Value("${app.dev-skip-email:false}") boolean devSkipEmail) {
        this.mailSender = mailSender;
        this.verificationUrl = verificationUrl;
        this.devSkipEmail = devSkipEmail;
    }

    @Override
    public void sendVerificationEmail(PortalUser user, String verificationToken) {
        String verificationLink = verificationUrl + "?token=" + verificationToken;
        log.info("Verification link for {}: {}", user.getEmail(), verificationLink);

        if (devSkipEmail) {
            log.debug("Skipping SMTP send (dev-skip-email=true) for {}", user.getEmail());
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Verify your Application Portal account");
        message.setText(
                "Hello " + user.getName() + ",\n\n" +
                        "Please verify your email by opening this link:\n\n" +
                        verificationLink + "\n\n" +
                        "This link is valid for 24 hours.\n\n" +
                        "Application Portal"
        );

        try {
            mailSender.send(message);
            log.info("Verification email sent to {}", user.getEmail());
        } catch (Exception ex) {
            log.error("Failed to send verification email to {}: {}", user.getEmail(), ex.getMessage(), ex);
        }
    }

    @Override
    public void sendOtpEmail(PortalUser user, String otpCode, com.cdac.application_management_system.enums.OtpType type) {
        log.info("EMAIL OTP for {} ({})", user.getEmail(), type);
        log.debug("OTP code for {} type={}: {}", user.getEmail(), type, otpCode);

        if (devSkipEmail) {
            log.debug("Skipping SMTP send (dev-skip-email=true) for OTP to {}", user.getEmail());
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Your Application Portal verification code");
        message.setText(
                "Hello " + user.getName() + ",\n\n" +
                        "Your one-time verification code is: " + otpCode + "\n\n" +
                        "This code expires in 10 minutes. Do not share it with anyone.\n\n" +
                        "Application Portal"
        );

        try {
            mailSender.send(message);
            log.info("OTP email sent to {} type={}", user.getEmail(), type);
        } catch (Exception ex) {
            log.error("Failed to send OTP email to {}: {}", user.getEmail(), ex.getMessage(), ex);
        }
    }
}
