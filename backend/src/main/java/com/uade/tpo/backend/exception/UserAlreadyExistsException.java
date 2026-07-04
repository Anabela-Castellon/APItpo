package com.uade.tpo.backend.exception;

// Excepción para usuario ya existente (no utilizada actualmente; el registro usa EmailAlreadyExistsException)
public class UserAlreadyExistsException extends RuntimeException {
  public UserAlreadyExistsException(String message) {
    super(message);
  }
}
