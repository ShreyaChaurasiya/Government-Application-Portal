package com.cdac.application_management_system.config;

import com.cdac.application_management_system.entity.PortalUser;
import com.cdac.application_management_system.enums.UserRole;
import com.cdac.application_management_system.repository.PortalUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner seedReviewer(PortalUserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String email = "reviewer@cdac.gov.in";
            if (!userRepository.existsByEmailIgnoreCase(email)) {
                PortalUser reviewer = new PortalUser();
                reviewer.setName("CDAC Reviewer");
                reviewer.setEmail(email);
                reviewer.setPhoneNumber("9876543210");
                reviewer.setPasswordHash(passwordEncoder.encode("Reviewer12"));
                reviewer.setRole(UserRole.REVIEWER);
                reviewer.setEmailVerified(Boolean.TRUE);
                reviewer.setPhoneVerified(Boolean.TRUE);
                reviewer.setVerified(Boolean.TRUE);
                reviewer.setCompanyName("CDAC");
                userRepository.save(reviewer);
                log.info("Seeded reviewer account: {} / Reviewer12", email);
            } else {
                log.debug("Reviewer account already exists: {}", email);
            }
        };
    }
}
