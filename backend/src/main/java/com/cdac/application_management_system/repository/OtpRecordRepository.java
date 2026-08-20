package com.cdac.application_management_system.repository;

import com.cdac.application_management_system.entity.OtpRecord;
import com.cdac.application_management_system.enums.OtpType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpRecordRepository extends JpaRepository<OtpRecord, Long> {

    Optional<OtpRecord> findTopByUserIdAndTypeAndUsedFalseOrderByExpiresAtDesc(Long userId, OtpType type);
}
