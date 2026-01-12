package com.umar.ems.controller;

import com.umar.ems.dto.EmployeeDto;
import com.umar.ems.entity.Employee;
import com.umar.ems.service.EmployeeService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//  /api/employees

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private EmployeeService employeeService;

    // Build Add Employee REST API
    @PostMapping
    public ResponseEntity<EmployeeDto> createEmployee(@RequestBody EmployeeDto employeeDto){
        EmployeeDto savedEmployee = employeeService.createEmployee(employeeDto);
        return new ResponseEntity<>(savedEmployee, HttpStatus.CREATED);
    }

    // Build Get Employee REST API

    @GetMapping("{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable("id") Long employeeId){
        EmployeeDto employeeDto =  employeeService.getEmployeeById(employeeId);
        return ResponseEntity.ok(employeeDto);
    }

    // Build Get All Employees REST API

    @GetMapping
    public ResponseEntity<List<EmployeeDto>> getAllEmployees(){
        List<EmployeeDto> employees =  employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    //Update Employee REST API

    @PutMapping("{id}")
    public ResponseEntity<EmployeeDto> updateEmployee(@PathVariable("id") Long employeeid,
                                                      @RequestBody EmployeeDto updatedEmployee){
         EmployeeDto employeeDto =  employeeService.updateEmployee(employeeid,updatedEmployee);
         return ResponseEntity.ok(employeeDto);
    }

    // Delete Employee By Id
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteEmployeeById(@PathVariable("id") Long employeeid){
        employeeService.deleteEmployee(employeeid);
        return ResponseEntity.ok("Employeed Successfully Deleted..!");
    }

}
