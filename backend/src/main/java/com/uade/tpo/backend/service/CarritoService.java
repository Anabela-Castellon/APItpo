package com.uade.tpo.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.backend.model.Carrito;
import com.uade.tpo.backend.model.ItemCarrito;
import com.uade.tpo.backend.model.Producto;
import com.uade.tpo.backend.repository.CarritoRepository;
import com.uade.tpo.backend.repository.ProductoRepository;
import com.uade.tpo.backend.exception.*;
import jakarta.transaction.Transactional;

// Lógica de negocio del carrito: agregar/quitar productos, validar stock, recalcular total y checkout
@Service
@Transactional
public class CarritoService {

  @Autowired
  private CarritoRepository carritoRepository;

  @Autowired
  private ProductoRepository productoRepository;

  // --- BASIC CRUD ---

  // Devuelve todos los carritos
  public List<Carrito> findAll() {
    return carritoRepository.findAll();
  }

  // Busca un carrito por id (puede no existir)
  public Optional<Carrito> findById(Long id) {
    return carritoRepository.findById(id);
  }

  // Crea/guarda un carrito nuevo
  public Carrito create(Carrito carrito) {
    return carritoRepository.save(carrito);
  }

  // Borra el carrito por completo
  public void delete(Long id) {
    carritoRepository.deleteById(id);
  }

  // --- SHOPPING CART SPECIFIC LOGIC ---

  /**
   * Adds a product to the cart. If the product is already there, it increases
   * quantity.
   */
  public Carrito addProductoToCarrito(Long carritoId, Long productoId, int cantidad) {
    // Buscamos el carrito. Si no existe, lanzamos el error que captura el
    // Controller
    Carrito carrito = carritoRepository.findById(carritoId)
        .orElseThrow(() -> new ResourceNotFoundException("No se encontró el carrito con ID: " + carritoId));

    Producto producto = productoRepository.findById(productoId)
        .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

    // Buscar si el producto ya está en el carrito para no duplicar filas
    Optional<ItemCarrito> itemExistente = carrito.getProductos().stream()
        .filter(item -> item.getProducto().getId().equals(productoId))
        .findFirst();

    // Validar stock disponible en la tabla maestra de Productos, considerando
    // la cantidad que ya estaba en el carrito (no solo la que se agrega ahora)
    int cantidadActual = itemExistente.map(ItemCarrito::getCantidad).orElse(0);
    int cantidadFinal = cantidadActual + cantidad;
    if (cantidadFinal > producto.getStock()) {
      throw new InsufficientStockException(
          "Solo quedan " + producto.getStock() + " unidades de " + producto.getNombre());
    }

    if (itemExistente.isPresent()) {
      // Si ya existe, aumentamos la cantidad en el item intermedio
      ItemCarrito item = itemExistente.get();
      item.setCantidad(item.getCantidad() + cantidad);
    } else {
      // Si es nuevo, creamos el vínculo
      ItemCarrito nuevoItem = new ItemCarrito();
      nuevoItem.setCarrito(carrito);
      nuevoItem.setProducto(producto);
      nuevoItem.setCantidad(cantidad);
      carrito.getProductos().add(nuevoItem);
    }

    recalculateTotal(carrito); //
    return carritoRepository.save(carrito);
  }

  /**
   * Removes an entire line item from the cart.
   */
  public Carrito removeProductoFromCarrito(Long carritoId, Long productoId) {
    Carrito carrito = carritoRepository.findById(carritoId)
        .orElseThrow(() -> new RuntimeException("Carrito not found"));

    // Remove the ItemCarrito entry that matches the product ID
    carrito.getProductos().removeIf(item -> item.getProducto().getId().equals(productoId));

    recalculateTotal(carrito);
    return carritoRepository.save(carrito);
  }

  /**
   * Clears all items from the cart.
   */
  public Carrito clearCarrito(Long id) {
    Carrito carrito = carritoRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Carrito not found"));

    // Because of orphanRemoval = true, this deletes rows from items_carrito table
    carrito.getProductos().clear();
    carrito.setPrecioTotal(0.0);

    return carritoRepository.save(carrito);
  }

  // Helper method: Price * Quantity for every item
  private void recalculateTotal(Carrito carrito) {
    double total = carrito.getProductos().stream()
        .mapToDouble(item -> item.getProducto().getPrecio() * item.getCantidad())
        .sum();
    carrito.setPrecioTotal(total);
  }

  // Confirma la compra: valida stock de todos los items, lo descuenta del catálogo y vacía el carrito
  public String checkout(Long carritoId) {
    Carrito carrito = carritoRepository.findById(carritoId)
        .orElseThrow(() -> new ResourceNotFoundException("Carrito no encontrado")); //

    if (carrito.getProductos().isEmpty()) {
      throw new RuntimeException("El carrito está vacío");
    }

    // 1. Validar stock
    for (ItemCarrito item : carrito.getProductos()) {
      Producto producto = item.getProducto();
      if (producto.getStock() < item.getCantidad()) {
        // Usamos la excepción personalizada
        throw new InsufficientStockException("Solo quedan " + producto.getStock() +
            " unidades de " + producto.getNombre());
      }
    }

    // 2. Descontar stock
    for (ItemCarrito item : carrito.getProductos()) {
      Producto producto = item.getProducto();
      producto.setStock(producto.getStock() - item.getCantidad());
      productoRepository.save(producto);
    }

    // 3. Finalizar
    double totalFinal = carrito.getPrecioTotal();
    carrito.getProductos().clear();
    carrito.setPrecioTotal(0.0);
    carritoRepository.save(carrito);

    return "Checkout exitoso. Total abonado: $" + totalFinal;
  }
}
