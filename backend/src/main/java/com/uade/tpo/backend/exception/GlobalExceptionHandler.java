package com.uade.tpo.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

// Centraliza el manejo de excepciones personalizadas y las traduce a respuestas HTTP con formato uniforme
@ControllerAdvice
public class GlobalExceptionHandler {

  // Recurso no encontrado (ej: producto/carrito/usuario inexistente) -> 404
  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<Object> handleResourceNotFound(ResourceNotFoundException ex) {
    Map<String, Object> body = new HashMap<>();
    body.put("error", "Recurso no encontrado");
    body.put("mensaje", ex.getMessage());
    return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
  }

  // Stock insuficiente al agregar al carrito o hacer checkout -> 400
  @ExceptionHandler(InsufficientStockException.class)
  public ResponseEntity<Object> handleInsufficientStock(InsufficientStockException ex) {
    Map<String, Object> body = new HashMap<>();
    body.put("error", "Error de Stock");
    body.put("mensaje", ex.getMessage());
    return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
  }

// Email duplicado al registrarse -> 409 (conflicto)
@ExceptionHandler(EmailAlreadyExistsException.class)
public ResponseEntity<Object> handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
    Map<String, Object> body = new HashMap<>();
    body.put("error", "Email duplicado");
    body.put("mensaje", ex.getMessage());
    return new ResponseEntity<>(body, HttpStatus.CONFLICT); // 409
}

// Clave maestra incorrecta al registrarse como ADMIN -> 403 (prohibido)
@ExceptionHandler(InvalidClaveMaestraException.class)
public ResponseEntity<Object> handleInvalidClaveMaestra(InvalidClaveMaestraException ex) {
    Map<String, Object> body = new HashMap<>();
    body.put("error", "Clave maestra inválida");
    body.put("mensaje", ex.getMessage());
    return new ResponseEntity<>(body, HttpStatus.FORBIDDEN); // 403
}
}