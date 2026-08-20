package com.cdac.application_management_system.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(nullable = false, length = 80)
    private String action;

    @Column(length = 500)
    private String details;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public AuditLog(Long userId, String action, String details) {
        this.userId = userId;
        this.action = action;
        this.details = details;
    }
}
