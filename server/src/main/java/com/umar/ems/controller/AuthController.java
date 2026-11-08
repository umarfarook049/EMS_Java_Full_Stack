package com.umar.ems.controller;

import com.umar.ems.dto.LoginRequest;
import com.umar.ems.dto.LoginResponse;
import com.umar.ems.entity.AppUser;
import com.umar.ems.entity.Employee;
import com.umar.ems.repository.AppUserRepository;
import com.umar.ems.repository.EmployeeRepository;
import com.umar.ems.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final JwtUtil jwtUtil;

    // "username" in the request is the company email OR the 6 digit employment code
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String loginId = request.getUsername() == null ? "" : request.getUsername().trim();
        String username = resolveUsername(loginId);

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, request.getPassword()));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        AppUser user = userRepository.findByUsername(username).orElseThrow();
        String token = jwtUtil.generateToken(user.getUsername());

        return ResponseEntity.ok(new LoginResponse(
                token, user.getUsername(), user.getRole().name(), user.getEmployeeId()));
    }

    private String resolveUsername(String loginId) {
        Optional<Employee> employee = loginId.matches("\\d{6}")
                ? employeeRepository.findByEmployeeCode(loginId)
                : employeeRepository.findByEmailIgnoreCase(loginId);

        return employee
                .flatMap(e -> userRepository.findByEmployeeId(e.getId()))
                .map(AppUser::getUsername)
                .orElse(loginId); // fallback: plain username such as "admin"
    }
}