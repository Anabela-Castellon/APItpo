package com.uade.tpo.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.backend.model.Categoria;
import com.uade.tpo.backend.model.Producto;
import com.uade.tpo.backend.repository.CategoriaRepository;
import com.uade.tpo.backend.repository.ProductoRepository;

import jakarta.transaction.Transactional;

// CRUD de productos y gestión de sus categorías asociadas
@Service
@Transactional
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    // Create
    public Producto saveProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    // Read
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    // Filtrar por categoria (valida antes que la categoría exista)
    public List<Producto> getProductosByCategoria(Long categoriaId) {
        // Validamos que la categoria exista
        categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada con id: " + categoriaId));
        return productoRepository.findByCategoriaId(categoriaId);
    }

    // Agregar una categoria a un producto existente
    public Producto agregarCategoria(Long productoId, Long categoriaId) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + productoId));
        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada con id: " + categoriaId));

        if (!producto.getCategorias().contains(categoria)) {
            producto.getCategorias().add(categoria);
        }
        return productoRepository.save(producto);
    }

    // Quitar una categoria de un producto
    public Producto quitarCategoria(Long productoId, Long categoriaId) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + productoId));
        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada con id: " + categoriaId));

        producto.getCategorias().remove(categoria);
        return productoRepository.save(producto);
    }

    // Update (reemplaza los campos editables; solo pisa categorías si vienen datos nuevos)
    public Producto updateProducto(Long id, Producto updatedData) {
        return productoRepository.findById(id).map(producto -> {
            producto.setNombre(updatedData.getNombre());
            producto.setDescripcion(updatedData.getDescripcion());
            producto.setPrecio(updatedData.getPrecio());
            producto.setStock(updatedData.getStock());
            if (updatedData.getCategorias() != null && !updatedData.getCategorias().isEmpty()) {
                producto.setCategorias(updatedData.getCategorias());
            }
            return productoRepository.save(producto);
        }).orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));
    }

    // Delete
    public void deleteProducto(Long id) {
        productoRepository.deleteById(id);
    }

    // Ordenados alfabeticamente
    public List<Producto> getProductosOrdenados() {
        return productoRepository.findAllByOrderByNombreAsc();
    }

    public Optional<Producto> getProductoById(Long id) {
        return productoRepository.findById(id);
    }
}
