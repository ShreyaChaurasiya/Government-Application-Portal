package com.cdac.application_management_system.repository;

import com.cdac.application_management_system.entity.PortalUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PortalUserRepository extends JpaRepository<PortalUser, Long> {

    Optional<PortalUser> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    Optional<PortalUser> findByVerificationToken(String token);
}
