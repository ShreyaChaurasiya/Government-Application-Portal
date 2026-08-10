package com.cdac.application_management_system.dto.response;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PersonnelResponseDTO {

    private Long id;

    private String name;

    private String role;

    private String nationality;

    private String dob;
}