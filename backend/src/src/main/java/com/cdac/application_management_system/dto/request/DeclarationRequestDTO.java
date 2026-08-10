package com.cdac.application_management_system.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeclarationRequestDTO {

    private String compliesLaws;

    private String hasInsurance;
}