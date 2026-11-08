package com.umar.ems.security;

import com.umar.ems.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("accessChecker")
@RequiredArgsConstructor
public class AccessChecker {

    private final AppUserRepository userRepository;

    public boolean isOwner(Authentication authentication, Long employeeId) {
        return userRepository.findByUsername(authentication.getName())
                .map(u -> u.getEmployeeId() != null && u.getEmployeeId().equals(employeeId))
                .orElse(false);
    }
}