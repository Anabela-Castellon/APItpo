package com.uade.tpo.backend.exception;

// Se lanza cuando se pide más cantidad de un producto que el stock disponible
public class InsufficientStockException extends RuntimeException {
  public InsufficientStockException(String message) {
    super(message);
  }
}
