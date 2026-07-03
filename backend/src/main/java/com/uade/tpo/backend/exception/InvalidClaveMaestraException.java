package com.uade.tpo.backend.exception;

public class InvalidClaveMaestraException extends RuntimeException {
    public InvalidClaveMaestraException() {
        super("La clave maestra ingresada es incorrecta.");
    }
}
