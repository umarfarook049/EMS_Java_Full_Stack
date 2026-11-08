package com.umar.ems.entity;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDate;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectAssignment {

    @NotBlank(message = "Project code is required")
    private String projectCode;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate; // null = current project

    @NotBlank(message = "Client / project name is required")
    private String clientProjectName;

    @NotBlank(message = "Reporting manager is required")
    @Pattern(regexp = "^(\\d{6}|[^@\\s]+@[^@\\s]+\\.[^@\\s]+)$", message = "Enter a 6 digit employee code or a valid email")
    private String reportingManager;
}