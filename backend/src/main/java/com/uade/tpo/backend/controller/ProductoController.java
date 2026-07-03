package com.uade.tpo.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.backend.model.Producto;
import com.uade.tpo.backend.service.ProductoService;

// Controlador de productos: lectura pública, escritura restringida a VENDEDOR/ADMIN (ver SecurityConfig)
@RestController
@RequestMapping("/api/productos")
public class ProductoController {

  @Autowired
  private ProductoService productoService;

  // POST /api/productos -> crear producto
  @PostMapping
  public ResponseEntity<Producto> createProducto(@RequestBody Producto producto) {
    return ResponseEntity.status(HttpStatus.CREATED).body(productoService.saveProducto(producto));
  }

  // GET /api/productos -> todos los productos
  @GetMapping
  public List<Producto> getAllProductos() {
    return productoService.getAllProductos();
  }

  // GET /api/productos/ordenados -> ordenados alfabeticamente
  @GetMapping("/ordenados")
  public List<Producto> getProductosOrdenados() {
    return productoService.getProductosOrdenados();
  }

  // GET /api/productos/categoria/1 -> filtrar por id de categoria
  @GetMapping("/categoria/{categoriaId}")
  public ResponseEntity<?> getByCategoria(@PathVariable Long categoriaId) {
    try {
      return ResponseEntity.ok(productoService.getProductosByCategoria(categoriaId));
    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
  }

  // GET /api/productos/1 -> detalle de un producto
  @GetMapping("/{id}")
  public Object getProductoById(@PathVariable Long id) {
      return productoService.getProductoById(id);
  }

  // POST /api/productos/1/categorias/2 -> agregar categoria a un producto
  @PostMapping("/{productoId}/categorias/{categoriaId}")
  public ResponseEntity<?> agregarCategoria(@PathVariable Long productoId, @PathVariable Long categoriaId) {
    try {
      return ResponseEntity.ok(productoService.agregarCategoria(productoId, categoriaId));
    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
  }

  // DELETE /api/productos/1/categorias/2 -> quitar categoria de un producto
  @DeleteMapping("/{productoId}/categorias/{categoriaId}")
  public ResponseEntity<?> quitarCategoria(@PathVariable Long productoId, @PathVariable Long categoriaId) {
    try {
      return ResponseEntity.ok(productoService.quitarCategoria(productoId, categoriaId));
    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
  }

  // PUT /api/productos/1 -> actualizar producto
  @PutMapping("/{id}")
  public ResponseEntity<Producto> updateProducto(@PathVariable Long id, @RequestBody Producto productoDetails) {
    try {
      return ResponseEntity.ok(productoService.updateProducto(id, productoDetails));
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    }
  }

  // DELETE /api/productos/1 -> eliminar producto
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
    productoService.deleteProducto(id);
    return ResponseEntity.noContent().build();
  }
}
