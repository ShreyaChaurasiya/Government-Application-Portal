package com.cdac.application_management_system.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PersonnelRequestDTO {

    private String name;

    private String role;

    private String email;

    private String nationality;

    private LocalDate dateOfBirth;
}
