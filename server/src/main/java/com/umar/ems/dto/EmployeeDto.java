package com.umar.ems.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.umar.ems.entity.PreviousEmployment;
import com.umar.ems.entity.ProjectAssignment;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class EmployeeDto {

    private Long id;

    // ---------- Personal details ----------
    @NotBlank(message = "Employment code is required")
    @Pattern(regexp = "\\d{6}", message = "Employment code must be a 6 digit number")
    private String employeeCode;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotNull(message = "Age is required")
    @Min(value = 1, message = "Age must be a positive number")
    @Max(value = 999, message = "Age can have at most 3 digits")
    private Integer age;

    @NotBlank(message = "Address line 1 is required")
    private String currentAddressLine1;
    @NotBlank(message = "Address line 2 is required")
    private String currentAddressLine2;
    @NotBlank(message = "City is required")
    private String currentCity;
    @Pattern(regexp = "\\d{6}", message = "Pin code must be a 6 digit number")
    private String currentPinCode;

    @NotBlank(message = "Address line 1 is required")
    private String permanentAddressLine1;
    @NotBlank(message = "Address line 2 is required")
    private String permanentAddressLine2;
    @NotBlank(message = "City is required")
    private String permanentCity;
    @Pattern(regexp = "\\d{6}", message = "Pin code must be a 6 digit number")
    private String permanentPinCode;

    @Pattern(regexp = "\\d{10}", message = "Mobile must be a 10 digit number")
    private String mobile;

    @NotBlank(message = "Personal email is required")
    @Email(message = "Enter a valid email address")
    private String personalEmail;

    @NotBlank(message = "Emergency contact name is required")
    private String emergencyContactName;

    @Pattern(regexp = "\\d{10}", message = "Mobile must be a 10 digit number")
    private String emergencyContactMobile;

    // ---------- Professional details ----------
    @NotBlank(message = "Company email is required")
    @Email(message = "Enter a valid email address")
    private String email;

    @Pattern(regexp = "\\d{8,12}", message = "Office phone must be 8 to 12 digits")
    private String officePhone;

    @NotBlank(message = "Office city is required")
    private String officeCity;
    @NotBlank(message = "Address line 1 is required")
    private String officeAddressLine1;
    @NotBlank(message = "Address line 2 is required")
    private String officeAddressLine2;
    @Pattern(regexp = "\\d{6}", message = "Pin code must be a 6 digit number")
    private String officePinCode;

    @NotBlank(message = "Reporting manager is required")
    @Pattern(regexp = "^(\\d{6}|[^@\\s]+@[^@\\s]+\\.[^@\\s]+)$", message = "Enter a 6 digit employee code or a valid email")
    private String reportingManager;

    @NotBlank(message = "HR name is required")
    private String hrName;

    @NotNull(message = "Date of joining is required")
    private LocalDate dateOfJoining;

    @Valid
    private List<PreviousEmployment> employmentHistory = new ArrayList<>();

    // ---------- Project details (optional) ----------
    @Valid
    private List<ProjectAssignment> projects = new ArrayList<>();

    // ---------- Finance ----------
    @Pattern(regexp = "[A-Z]{5}[0-9]{4}[A-Z]", message = "Enter a valid PAN (e.g. ABCDE1234F)")
    private String panNumber;

    @Pattern(regexp = "\\d{12}", message = "Aadhar must be a 12 digit number")
    private String aadharNumber;

    @NotBlank(message = "Bank name is required")
    private String bankName;

    @NotBlank(message = "Branch is required")
    private String branch;

    @Pattern(regexp = "[A-Z]{4}0[A-Z0-9]{6}", message = "Enter a valid IFSC code")
    private String ifscCode;

    @NotNull(message = "Annual CTC is required")
    @Positive(message = "Annual CTC must be greater than 0")
    private BigDecimal annualCtc;
    @NotNull(message = "Basic is required")
    @PositiveOrZero(message = "Must not be negative")
    private BigDecimal ctcBasic;
    @NotNull(message = "HRA is required")
    @PositiveOrZero(message = "Must not be negative")
    private BigDecimal ctcHra;
    @NotNull(message = "Allowances is required")
    @PositiveOrZero(message = "Must not be negative")
    private BigDecimal ctcAllowances;

    // ---------- Login (used only when creating an employee) ----------
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    // ---------- Computed for the dashboard ----------
    private String managerName;
    private String currentProjectName;
}