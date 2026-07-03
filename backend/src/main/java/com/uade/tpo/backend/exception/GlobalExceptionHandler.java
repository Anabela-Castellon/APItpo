package com.uade.tpo.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<Object> handleResourceNotFound(ResourceNotFoundException ex) {
    Map<String, Object> body = new HashMap<>();
    body.put("error", "Recurso no encontrado");
    body.put("mensaje", ex.getMessage());
    return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(InsufficientStockException.class)
  public ResponseEntity<Object> handleInsufficientStock(InsufficientStockException ex) {
    Map<String, Object> body = new HashMap<>();
    body.put("error", "Error de Stock");
    body.put("mensaje", ex.getMessage());
    return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
  }

@ExceptionHandler(EmailAlreadyExistsException.class)
public ResponseEntity<Object> handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
    Map<String, Object> body = new HashMap<>();
    body.put("error", "Email duplicado");
    body.put("mensaje", ex.getMessage());
    return new ResponseEntity<>(body, HttpStatus.CONFLICT); // 409
}

@ExceptionHandler(InvalidClaveMaestraException.class)
public ResponseEntity<Object> handleInvalidClaveMaestra(InvalidClaveMaestraException ex) {
    Map<String, Object> body = new HashMap<>();
    body.put("error", "Clave maestra inválida");
    body.put("mensaje", ex.getMessage());
    return new ResponseEntity<>(body, HttpStatus.FORBIDDEN); // 403
}
}