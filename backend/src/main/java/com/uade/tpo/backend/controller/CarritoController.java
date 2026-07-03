package com.uade.tpo.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.backend.model.Carrito;
import com.uade.tpo.backend.service.CarritoService;

// Controlador del carrito de compras: acceso restringido a usuarios autenticados
@RestController
@RequestMapping("/api/carritos")
public class CarritoController {

  @Autowired
  private CarritoService carritoService;

  // 1. Devuelve todos los carritos existentes
  @GetMapping
  public List<Carrito> getAllCarritos() {
    return carritoService.findAll();
  }

  // 2. Devuelve un carrito puntual por id (404 si no existe)
  @GetMapping("/{id}")
  public ResponseEntity<Carrito> getCarritoById(@PathVariable Long id) {
    return carritoService.findById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  // 3. Agrega un producto al carrito (o suma cantidad si ya estaba)
  // Path example: POST /api/carritos/1/productos/5
  @PostMapping("/{carritoId}/productos/{productoId}")
  public ResponseEntity<?> addProducto(
      @PathVariable Long carritoId,
      @PathVariable Long productoId,
      @RequestParam(defaultValue = "1") int cantidad) {
    try {
      Carrito carritoActualizado = carritoService.addProductoToCarrito(carritoId, productoId, cantidad);
      return ResponseEntity.ok(carritoActualizado);
    } catch (RuntimeException e) {
      // Si el ID del carrito o producto no existen, devolvemos el mensaje de error
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
  }

  // 4. Confirma la compra: descuenta stock y vacía el carrito
  @PostMapping("/{id}/checkout")
  public ResponseEntity<String> checkout(@PathVariable Long id) {
    try {
      String mensaje = carritoService.checkout(id);
      return ResponseEntity.ok(mensaje);
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  // 5. Quita un producto puntual del carrito
  @DeleteMapping("/{carritoId}/productos/{productoId}")
  public ResponseEntity<Carrito> removeProducto(@PathVariable Long carritoId, @PathVariable Long productoId) {
    return ResponseEntity.ok(carritoService.removeProductoFromCarrito(carritoId, productoId));
  }

  // 6. Elimina el carrito completo (no solo vaciarlo)
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteCarrito(@PathVariable Long id) {
    carritoService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/{id}/vaciar") //este solo vacia el carrito, no lo borra
public ResponseEntity<Carrito> vaciarCarrito(@PathVariable Long id) {
    return ResponseEntity.ok(carritoService.clearCarrito(id));
}
}
