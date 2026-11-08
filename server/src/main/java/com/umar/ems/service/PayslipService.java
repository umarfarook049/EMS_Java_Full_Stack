package com.umar.ems.service;

import com.umar.ems.dto.SalaryDto;

import java.util.List;

public interface PayslipService {
    SalaryDto saveSalary(Long employeeId, SalaryDto salaryDto);

    SalaryDto getSalary(Long employeeId, int month, int year);

    SalaryDto getLatestSalary(Long employeeId);

    List<SalaryDto> getRecentPayslips(Long employeeId);

    byte[] generatePayslip(Long employeeId, int month, int year);
}