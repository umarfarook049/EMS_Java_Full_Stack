package com.umar.ems.entity;

import jakarta.persistence.*;
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
@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ---------- Personal details ----------
    @Column(name = "employee_code", unique = true)
    private String employeeCode;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private LocalDate dateOfBirth;
    private String gender;
    private Integer age;

    private String currentAddressLine1;
    private String currentAddressLine2;
    private String currentCity;
    private String currentPinCode;

    private String permanentAddressLine1;
    private String permanentAddressLine2;
    private String permanentCity;
    private String permanentPinCode;

    private String mobile;
    private String personalEmail;
    private String emergencyContactName;
    private String emergencyContactMobile;

    // ---------- Professional details ----------
    @Column(name = "email_id", nullable = false, unique = true)
    private String email; // company email

    private String officePhone;
    private String officeCity;
    private String officeAddressLine1;
    private String officeAddressLine2;
    private String officePinCode;

    private String reportingManager; // employee code or email
    private String hrName;
    private LocalDate dateOfJoining;

    @ElementCollection
    @CollectionTable(name = "employment_history", joinColumns = @JoinColumn(name = "employee_id"))
    @OrderColumn(name = "list_order")
    private List<PreviousEmployment> employmentHistory = new ArrayList<>();

    // ---------- Project details (optional) ----------
    @ElementCollection
    @CollectionTable(name = "employee_projects", joinColumns = @JoinColumn(name = "employee_id"))
    @OrderColumn(name = "list_order")
    private List<ProjectAssignment> projects = new ArrayList<>();

    // ---------- Finance ----------
    private String panNumber;
    private String aadharNumber;
    private String bankName;
    private String branch;
    private String ifscCode;

    private BigDecimal annualCtc;
    private BigDecimal ctcBasic;
    private BigDecimal ctcHra;
    private BigDecimal ctcAllowances;
}