package com.umar.ems.service.impl;

import com.umar.ems.dto.EmployeeDto;
import com.umar.ems.entity.AppUser;
import com.umar.ems.entity.Employee;
import com.umar.ems.entity.ProjectAssignment;
import com.umar.ems.entity.Role;
import com.umar.ems.exception.ApiValidationException;
import com.umar.ems.exception.ResourceNotFoundException;
import com.umar.ems.repository.AppUserRepository;
import com.umar.ems.repository.EmployeeRepository;
import com.umar.ems.repository.MonthlySalaryRepository;
import com.umar.ems.service.EmployeeService;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    // never overwritten on update (code, gender, DOB, company mail, DOJ are
    // admin-locked)
    private static final String[] LOCKED_OR_INTERNAL = {
            "id", "employeeCode", "gender", "dateOfBirth", "email", "dateOfJoining",
            "employmentHistory", "projects"
    };

    private final EmployeeRepository employeeRepository;
    private final MonthlySalaryRepository salaryRepository;
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public EmployeeDto createEmployee(EmployeeDto dto) {
        if (dto.getPassword() == null || dto.getPassword().length() < 6) {
            throw new ApiValidationException(HttpStatus.BAD_REQUEST, "password",
                    "Initial password must be at least 6 characters");
        }
        if (employeeRepository.findByEmployeeCode(dto.getEmployeeCode()).isPresent()) {
            throw new ApiValidationException(HttpStatus.CONFLICT, "employeeCode",
                    "Employment code already exists");
        }
        if (employeeRepository.findByEmailIgnoreCase(dto.getEmail()).isPresent()
                || appUserRepository.existsByUsername(dto.getEmail())) {
            throw new ApiValidationException(HttpStatus.CONFLICT, "email",
                    "Company email already exists");
        }

        Employee employee = new Employee();
        BeanUtils.copyProperties(dto, employee, "id", "employmentHistory", "projects");
        employee.setEmploymentHistory(copy(dto.getEmploymentHistory()));
        employee.setProjects(copy(dto.getProjects()));
        Employee saved = employeeRepository.save(employee);

        // every employee gets a login (username = company email)
        appUserRepository.save(new AppUser(null, saved.getEmail(),
                passwordEncoder.encode(dto.getPassword()), Role.USER, saved.getId()));

        return toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeDto getEmployeeById(Long employeeId) {
        return toDto(findOrThrow(employeeId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    @Transactional
    public EmployeeDto updateEmployee(Long employeeId, EmployeeDto dto) {
        Employee employee = findOrThrow(employeeId);

        BeanUtils.copyProperties(dto, employee, LOCKED_OR_INTERNAL);

        // locked fields can be set only if they were never filled (e.g. the seeded
        // admin record)
        if (employee.getEmployeeCode() == null)
            employee.setEmployeeCode(dto.getEmployeeCode());
        if (employee.getGender() == null)
            employee.setGender(dto.getGender());
        if (employee.getDateOfBirth() == null)
            employee.setDateOfBirth(dto.getDateOfBirth());
        if (employee.getDateOfJoining() == null)
            employee.setDateOfJoining(dto.getDateOfJoining());

        employee.getEmploymentHistory().clear();
        employee.getEmploymentHistory().addAll(copy(dto.getEmploymentHistory()));
        employee.getProjects().clear();
        employee.getProjects().addAll(copy(dto.getProjects()));

        return toDto(employeeRepository.save(employee));
    }

    @Override
    @Transactional
    public void deleteEmployee(Long employeeId) {
        findOrThrow(employeeId);

        Optional<AppUser> account = appUserRepository.findByEmployeeId(employeeId);
        if (account.isPresent() && account.get().getRole() == Role.ADMIN) {
            throw new ApiValidationException(HttpStatus.CONFLICT, "id", "The admin cannot be deleted");
        }

        salaryRepository.deleteByEmployeeId(employeeId);
        appUserRepository.deleteByEmployeeId(employeeId);
        employeeRepository.deleteById(employeeId);
    }

    // ---------- helpers ----------

    private Employee findOrThrow(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee is not exist with given id : " + id));
    }

    private <T> List<T> copy(List<T> list) {
        return list == null ? new ArrayList<>() : new ArrayList<>(list);
    }

    private EmployeeDto toDto(Employee e) {
        EmployeeDto dto = new EmployeeDto();
        BeanUtils.copyProperties(e, dto, "employmentHistory", "projects");
        dto.setEmploymentHistory(new ArrayList<>(e.getEmploymentHistory()));
        dto.setProjects(new ArrayList<>(e.getProjects()));
        dto.setManagerName(resolveManagerName(e.getReportingManager()));
        dto.setCurrentProjectName(currentProject(e.getProjects()));
        return dto;
    }

    private String resolveManagerName(String ref) {
        if (ref == null || ref.isBlank())
            return null;
        Optional<Employee> manager = ref.matches("\\d{6}")
                ? employeeRepository.findByEmployeeCode(ref)
                : employeeRepository.findByEmailIgnoreCase(ref);
        return manager.map(m -> m.getFirstName() + " " + m.getLastName()).orElse(ref);
    }

    private String currentProject(List<ProjectAssignment> projects) {
        LocalDate today = LocalDate.now();
        return projects.stream()
                .filter(p -> p.getEndDate() == null || !p.getEndDate().isBefore(today))
                .max(Comparator.comparing(ProjectAssignment::getStartDate,
                        Comparator.nullsFirst(Comparator.naturalOrder())))
                .map(ProjectAssignment::getClientProjectName)
                .orElse(null);
    }
}