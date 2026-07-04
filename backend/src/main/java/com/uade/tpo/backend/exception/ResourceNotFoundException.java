package com.uade.tpo.backend.exception;

// Excepción genérica para cuando no se encuentra una entidad por id (producto, carrito, consulta, etc.)
public class ResourceNotFoundException extends RuntimeException {
  public ResourceNotFoundException(String message) {
    super(message);
  }
}
