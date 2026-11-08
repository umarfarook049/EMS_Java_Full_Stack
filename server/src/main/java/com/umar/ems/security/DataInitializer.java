package com.umar.ems.security;

import com.umar.ems.entity.AppUser;
import com.umar.ems.entity.Employee;
import com.umar.ems.entity.Role;
import com.umar.ems.repository.AppUserRepository;
import com.umar.ems.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AppUserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username}")
    private String adminUsername;
    @Value("${app.admin.password}")
    private String adminPassword;
    @Value("${app.admin.first-name}")
    private String adminFirstName;
    @Value("${app.admin.last-name}")
    private String adminLastName;
    @Value("${app.admin.email}")
    private String adminEmail;
    @Value("${app.admin.employee-code}")
    private String adminEmployeeCode;

    @Override
    public void run(String... args) {
        AppUser admin = userRepository.findByUsername(adminUsername).orElse(null);
        if (admin == null) {
            admin = new AppUser(null, adminUsername,
                    passwordEncoder.encode(adminPassword), Role.ADMIN, null);
        }

        Employee employee = admin.getEmployeeId() == null
                ? new Employee()
                : employeeRepository.findById(admin.getEmployeeId()).orElse(new Employee());

        if (employee.getEmployeeCode() == null)
            employee.setEmployeeCode(adminEmployeeCode);
        if (employee.getFirstName() == null)
            employee.setFirstName(adminFirstName);
        if (employee.getLastName() == null)
            employee.setLastName(adminLastName);
        if (employee.getEmail() == null)
            employee.setEmail(adminEmail);

        admin.setEmployeeId(employeeRepository.save(employee).getId());
        userRepository.save(admin);
    }
}