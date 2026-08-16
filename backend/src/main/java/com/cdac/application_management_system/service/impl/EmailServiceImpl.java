package com.cdac.application_management_system.service.impl;

import com.cdac.application_management_system.entity.PortalUser;
import com.cdac.application_management_system.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

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

        System.out.println("=================================");
        System.out.println("VERIFICATION LINK FOR " + user.getEmail());
        System.out.println(verificationLink);
        System.out.println("=================================");

        if (devSkipEmail) {
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
        } catch (Exception ex) {
            System.err.println("Could not send email. Use the verification link printed above.");
        }
    }
}
