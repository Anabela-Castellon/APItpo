package com.uade.tpo.backend.exception;

// Se lanza cuando la clave maestra ingresada al registrar un ADMIN no coincide con la guardada
public class InvalidClaveMaestraException extends RuntimeException {
    public InvalidClaveMaestraException() {
        super("La clave maestra ingresada es incorrecta.");
    }
}
