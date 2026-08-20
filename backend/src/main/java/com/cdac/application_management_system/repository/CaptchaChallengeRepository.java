package com.cdac.application_management_system.repository;

import com.cdac.application_management_system.entity.CaptchaChallenge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaptchaChallengeRepository extends JpaRepository<CaptchaChallenge, String> {
}
