package com.umar.ems.service.impl;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.umar.ems.dto.SalaryDto;
import com.umar.ems.entity.Employee;
import com.umar.ems.entity.MonthlySalary;
import com.umar.ems.exception.ResourceNotFoundException;
import com.umar.ems.repository.EmployeeRepository;
import com.umar.ems.repository.MonthlySalaryRepository;
import com.umar.ems.service.PayslipService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@Service
@AllArgsConstructor
public class PayslipServiceImpl implements PayslipService {

    private final EmployeeRepository employeeRepository;
    private final MonthlySalaryRepository salaryRepository;

    @Override
    @Transactional
    public SalaryDto saveSalary(Long employeeId, SalaryDto dto) {
        Employee employee = findEmployee(employeeId);

        MonthlySalary salary = salaryRepository
                .findByEmployeeIdAndMonthAndYear(employeeId, dto.getMonth(), dto.getYear())
                .orElseGet(() -> {
                    MonthlySalary s = new MonthlySalary();
                    s.setEmployee(employee);
                    s.setMonth(dto.getMonth());
                    s.setYear(dto.getYear());
                    return s;
                });

        salary.setBasic(nz(dto.getBasic()));
        salary.setHra(nz(dto.getHra()));
        salary.setAllowances(nz(dto.getAllowances()));
        salary.setProvidentFund(nz(dto.getProvidentFund()));
        salary.setTax(nz(dto.getTax()));

        return toDto(salaryRepository.save(salary));
    }

    @Override
    @Transactional(readOnly = true)
    public SalaryDto getSalary(Long employeeId, int month, int year) {
        return toDto(findSalary(employeeId, month, year));
    }

    @Override
    @Transactional(readOnly = true)
    public SalaryDto getLatestSalary(Long employeeId) {
        return salaryRepository.findFirstByEmployeeIdOrderByYearDescMonthDesc(employeeId)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No salary records found for employee id : " + employeeId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalaryDto> getRecentPayslips(Long employeeId) {
        return salaryRepository.findTop6ByEmployeeIdOrderByYearDescMonthDesc(employeeId)
                .stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] generatePayslip(Long employeeId, int month, int year) {
        Employee employee = findEmployee(employeeId);
        MonthlySalary s = findSalary(employeeId, month, year);

        BigDecimal gross = s.getBasic().add(s.getHra()).add(s.getAllowances());
        BigDecimal deductions = s.getProvidentFund().add(s.getTax());
        BigDecimal net = gross.subtract(deductions);

        String monthName = monthName(month);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 40, 40, 40, 40);
        PdfWriter.getInstance(document, out);
        document.open();

        Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
        Font boldFont = new Font(Font.HELVETICA, 11, Font.BOLD);
        Font normalFont = new Font(Font.HELVETICA, 11, Font.NORMAL);

        Paragraph title = new Paragraph("PAYSLIP", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        Paragraph period = new Paragraph("Pay Period: " + monthName + " " + year, boldFont);
        period.setAlignment(Element.ALIGN_CENTER);
        period.setSpacingAfter(20);
        document.add(period);

        PdfPTable info = new PdfPTable(2);
        info.setWidthPercentage(100);
        info.setSpacingAfter(15);
        addRow(info, "Employee Code", nvl(employee.getEmployeeCode()), boldFont, normalFont, false);
        addRow(info, "Name", employee.getFirstName() + " " + employee.getLastName(), boldFont, normalFont, false);
        addRow(info, "Company Email", nvl(employee.getEmail()), boldFont, normalFont, false);
        addRow(info, "Date of Joining",
                employee.getDateOfJoining() == null ? "-" : employee.getDateOfJoining().toString(),
                boldFont, normalFont, false);
        addRow(info, "PAN", nvl(employee.getPanNumber()), boldFont, normalFont, false);
        addRow(info, "Bank", nvl(employee.getBankName()), boldFont, normalFont, false);
        addRow(info, "Month", monthName + " " + year, boldFont, normalFont, false);
        document.add(info);

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setWidths(new float[] { 3f, 2f });
        addHeader(table, "Earnings", "Amount (Rs.)", boldFont);
        addRow(table, "Basic Salary", fmt(s.getBasic()), normalFont, normalFont, true);
        addRow(table, "HRA", fmt(s.getHra()), normalFont, normalFont, true);
        addRow(table, "Allowances", fmt(s.getAllowances()), normalFont, normalFont, true);
        addRow(table, "Gross Earnings", fmt(gross), boldFont, boldFont, true);

        addHeader(table, "Deductions", "Amount (Rs.)", boldFont);
        addRow(table, "Provident Fund", fmt(s.getProvidentFund()), normalFont, normalFont, true);
        addRow(table, "Income Tax", fmt(s.getTax()), normalFont, normalFont, true);
        addRow(table, "Total Deductions", fmt(deductions), boldFont, boldFont, true);

        addHeader(table, "NET PAY", fmt(net), boldFont);
        document.add(table);

        Paragraph footer = new Paragraph(
                "This is a system-generated payslip for " + monthName + " " + year + ".", normalFont);
        footer.setSpacingBefore(25);
        footer.setAlignment(Element.ALIGN_CENTER);
        document.add(footer);

        document.close();
        return out.toByteArray();
    }

    // ---------- helpers ----------

    private Employee findEmployee(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee is not exist with given id : " + id));
    }

    private MonthlySalary findSalary(Long employeeId, int month, int year) {
        return salaryRepository.findByEmployeeIdAndMonthAndYear(employeeId, month, year)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payslip for " + monthName(month) + " " + year + " is not available"));
    }

    private SalaryDto toDto(MonthlySalary s) {
        return new SalaryDto(s.getMonth(), s.getYear(), s.getBasic(), s.getHra(),
                s.getAllowances(), s.getProvidentFund(), s.getTax());
    }

    private String monthName(int month) {
        return Month.of(month).getDisplayName(TextStyle.FULL, Locale.ENGLISH);
    }

    private BigDecimal nz(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }

    private String nvl(String v) {
        return v == null || v.isBlank() ? "-" : v;
    }

    private String fmt(BigDecimal v) {
        return String.format("%,.2f", v);
    }

    private void addHeader(PdfPTable table, String left, String right, Font font) {
        for (String text : new String[] { left, right }) {
            PdfPCell cell = new PdfPCell(new Phrase(text, font));
            cell.setBackgroundColor(new Color(220, 230, 241));
            cell.setPadding(6);
            table.addCell(cell);
        }
    }

    private void addRow(PdfPTable table, String label, String value,
            Font labelFont, Font valueFont, boolean bordered) {
        PdfPCell l = new PdfPCell(new Phrase(label, labelFont));
        PdfPCell v = new PdfPCell(new Phrase(value, valueFont));
        v.setHorizontalAlignment(bordered ? Element.ALIGN_RIGHT : Element.ALIGN_LEFT);
        for (PdfPCell c : new PdfPCell[] { l, v }) {
            c.setPadding(6);
            if (!bordered)
                c.setBorder(Rectangle.NO_BORDER);
            table.addCell(c);
        }
    }
}