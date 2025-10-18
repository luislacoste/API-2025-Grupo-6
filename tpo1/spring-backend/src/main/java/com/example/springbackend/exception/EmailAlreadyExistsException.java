package com.example.springbackend.exception;

/**
* Custom exception to indicate that an email address is already registered.
* Thrown from the AuthenticationService when attempting to register a user with an existing email address.
*/
public class EmailAlreadyExistsException extends RuntimeException {

    public EmailAlreadyExistsException(String message) {
        super(message);
    }

    public EmailAlreadyExistsException() {
        super("The email is already registered.");
    }
}

