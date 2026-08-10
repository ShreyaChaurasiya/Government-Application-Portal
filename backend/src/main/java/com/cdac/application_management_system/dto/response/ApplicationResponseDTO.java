package com.cdac.application_management_system.dto.response;
import com.cdac.application_management_system.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponseDTO {

    private Long id;

    private String companyName;

    private String address;

    private String country;

    private String projectDescription;

    private String email;

    private String placeOfStay;

    private String phoneNumber;

    private boolean selfDeclaration;

    private List<PersonnelResponseDTO> personnel;

    private com.cdac.application_management_system.dto.response.DeclarationResponseDTO declarations;

    private ApplicationStatus status;

    private String reviewerRemarks;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}