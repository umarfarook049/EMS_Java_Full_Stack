package com.umar.ems.entity;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PreviousEmployment {

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotNull(message = "Joining date is required")
    private LocalDate joiningDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;
}