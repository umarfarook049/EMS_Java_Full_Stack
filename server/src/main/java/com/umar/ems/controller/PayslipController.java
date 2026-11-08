package com.umar.ems.controller;

import com.umar.ems.dto.SalaryDto;
import com.umar.ems.service.PayslipService;
import lombok.AllArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/employees/{employeeId}")
public class PayslipController {

    private final PayslipService payslipService;

    // Admin saves salary for one month: body includes "month" and "year"
    @PutMapping("/salary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SalaryDto> saveSalary(@PathVariable Long employeeId,
            @RequestBody SalaryDto salaryDto) {
        if (invalid(salaryDto.getMonth(), salaryDto.getYear())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(payslipService.saveSalary(employeeId, salaryDto));
    }

    // Salary of a specific month: /salary?month=10&year=2026
    @GetMapping("/salary")
    @PreAuthorize("hasRole('ADMIN') or @accessChecker.isOwner(authentication, #employeeId)")
    public ResponseEntity<SalaryDto> getSalary(@PathVariable Long employeeId,
            @RequestParam Integer month,
            @RequestParam Integer year) {
        if (invalid(month, year)) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(payslipService.getSalary(employeeId, month, year));
    }

    // Most recent saved month, used to pre-fill the admin form
    @GetMapping("/salary/latest")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SalaryDto> getLatestSalary(@PathVariable Long employeeId) {
        return ResponseEntity.ok(payslipService.getLatestSalary(employeeId));
    }

    // Last 6 saved months, used by the employee dashboard
    @GetMapping("/payslips/recent")
    @PreAuthorize("hasRole('ADMIN') or @accessChecker.isOwner(authentication, #employeeId)")
    public ResponseEntity<List<SalaryDto>> getRecentPayslips(@PathVariable Long employeeId) {
        return ResponseEntity.ok(payslipService.getRecentPayslips(employeeId));
    }

    // Download: /payslip?month=10&year=2026
    @GetMapping("/payslip")
    @PreAuthorize("hasRole('ADMIN') or @accessChecker.isOwner(authentication, #employeeId)")
    public ResponseEntity<byte[]> downloadPayslip(@PathVariable Long employeeId,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        LocalDate today = LocalDate.now();
        int m = (month != null) ? month : today.getMonthValue();
        int y = (year != null) ? year : today.getYear();

        if (invalid(m, y)) {
            return ResponseEntity.badRequest().build();
        }

        byte[] pdf = payslipService.generatePayslip(employeeId, m, y);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("payslip_" + employeeId + "_" + y + "_" + String.format("%02d", m) + ".pdf")
                .build());

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }

    private boolean invalid(Integer month, Integer year) {
        return month == null || year == null
                || month < 1 || month > 12
                || year < 2000 || year > 2100;
    }
}