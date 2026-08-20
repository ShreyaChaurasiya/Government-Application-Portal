package com.cdac.application_management_system.service.impl;

import com.cdac.application_management_system.dto.response.CaptchaResponseDTO;
import com.cdac.application_management_system.entity.CaptchaChallenge;
import com.cdac.application_management_system.repository.CaptchaChallengeRepository;
import com.cdac.application_management_system.service.CaptchaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class CaptchaServiceImpl implements CaptchaService {

    private static final Logger log = LoggerFactory.getLogger(CaptchaServiceImpl.class);

    private final CaptchaChallengeRepository captchaRepository;
    private final PasswordEncoder passwordEncoder;

    public CaptchaServiceImpl(CaptchaChallengeRepository captchaRepository, PasswordEncoder passwordEncoder) {
        this.captchaRepository = captchaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public CaptchaResponseDTO generate() {
        int left = ThreadLocalRandom.current().nextInt(2, 12);
        int right = ThreadLocalRandom.current().nextInt(2, 12);
        String answer = String.valueOf(left + right);
        String question = left + " + " + right;

        CaptchaChallenge challenge = new CaptchaChallenge();
        challenge.setId(UUID.randomUUID().toString());
        challenge.setAnswerHash(passwordEncoder.encode(answer));
        challenge.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        challenge.setUsed(false);
        captchaRepository.save(challenge);

        log.debug("Captcha generated id={} question={}", challenge.getId(), question);
        return new CaptchaResponseDTO(challenge.getId(), question);
    }

    @Override
    public void validate(String captchaId, String answer) {
        CaptchaChallenge challenge = captchaRepository.findById(captchaId)
                .orElseThrow(() -> {
                    log.warn("Captcha not found id={}", captchaId);
                    return new RuntimeException("Invalid captcha. Please try again.");
                });

        if (challenge.isUsed() || challenge.getExpiresAt().isBefore(LocalDateTime.now())) {
            log.warn("Captcha expired or already used id={}", captchaId);
            throw new RuntimeException("Captcha expired. Please refresh and try again.");
        }

        if (!passwordEncoder.matches(answer.trim(), challenge.getAnswerHash())) {
            log.warn("Incorrect captcha answer id={}", captchaId);
            throw new RuntimeException("Incorrect captcha answer.");
        }

        challenge.setUsed(true);
        captchaRepository.save(challenge);
        log.debug("Captcha validated id={}", captchaId);
    }
}
