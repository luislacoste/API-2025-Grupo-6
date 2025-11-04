package com.example.springbackend.exception;

/**
 * Exception thrown when invalid data is provided
 */
public class BadRequestException extends RuntimeException {
    
    public BadRequestException(String message) {
        super(message);
    }
}
