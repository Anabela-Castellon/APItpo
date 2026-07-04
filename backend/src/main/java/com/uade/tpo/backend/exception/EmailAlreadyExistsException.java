package com.uade.tpo.backend.exception;

// Se lanza al intentar registrar un email que ya existe en la BD (manejada por GlobalExceptionHandler -> 409)
public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String email) {
        super("El email '" + email + "' ya está registrado.");
    }
}
