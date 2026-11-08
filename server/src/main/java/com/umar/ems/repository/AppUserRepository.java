package com.umar.ems.repository;

import com.umar.ems.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByUsername(String username);

    boolean existsByUsername(String username);

    Optional<AppUser> findByEmployeeId(Long employeeId);

    void deleteByEmployeeId(Long employeeId);

    boolean existsByEmployeeId(Long employeeId);
}