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

    @Value("${app.verification-url}")
    private String verificationUrl;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendVerificationEmail(
            PortalUser user,
            String verificationToken
    ) {

        String verificationLink =
                verificationUrl + "?token=" + verificationToken;

        System.out.println("=================================");
        System.out.println("SENDING VERIFICATION EMAIL");
        System.out.println("TO: " + user.getEmail());
        System.out.println("LINK: " + verificationLink);
        System.out.println("=================================");

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(user.getEmail());

        message.setSubject(
                "Verify your Application Management System account"
        );

        message.setText(
                "Hello " + user.getName() + ",\n\n" +
                        "Thank you for registering with the Application Management System.\n\n" +
                        "Please verify your email address by clicking the link below:\n\n" +
                        verificationLink + "\n\n" +
                        "This verification link is valid for 24 hours.\n\n" +
                        "If you did not create this account, you can ignore this email.\n\n" +
                        "Regards,\n" +
                        "Application Management System"
        );

        mailSender.send(message);

        System.out.println("EMAIL SEND COMPLETED");
    }
}