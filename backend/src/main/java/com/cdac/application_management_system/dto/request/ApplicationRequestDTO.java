package com.cdac.application_management_system.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationRequestDTO {

    private String companyName;

    private String address;

    private String country;

    private String projectDescription;

    private String email;

    private String placeOfStay;

    private String phoneNumber;

    private boolean selfDeclaration;

    private List<PersonnelRequestDTO> personnel;

    private DeclarationRequestDTO declarations;
}