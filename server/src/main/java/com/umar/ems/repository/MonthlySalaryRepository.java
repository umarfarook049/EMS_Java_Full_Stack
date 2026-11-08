package com.umar.ems.repository;

import com.umar.ems.entity.MonthlySalary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MonthlySalaryRepository extends JpaRepository<MonthlySalary, Long> {

    Optional<MonthlySalary> findByEmployeeIdAndMonthAndYear(Long employeeId, Integer month, Integer year);

    // used to pre-fill the form for a new month
    Optional<MonthlySalary> findFirstByEmployeeIdOrderByYearDescMonthDesc(Long employeeId);

    List<MonthlySalary> findTop6ByEmployeeIdOrderByYearDescMonthDesc(Long employeeId);

    void deleteByEmployeeId(Long employeeId);
}