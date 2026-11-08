package com.umar.ems.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ApiValidationException extends RuntimeException {

    private final HttpStatus status;
    private final String field;

    public ApiValidationException(HttpStatus status, String field, String message) {
        super(message);
        this.status = status;
        this.field = field;
    }
}