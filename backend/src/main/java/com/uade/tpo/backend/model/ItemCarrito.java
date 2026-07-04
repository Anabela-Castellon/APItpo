package com.uade.tpo.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

// Entidad intermedia entre Carrito y Producto: representa una línea del carrito (producto + cantidad)
@Data
@Entity
@Table(name = "items_carrito")
public class ItemCarrito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    // Referencia inversa al carrito dueño (evita bucle infinito al serializar a JSON)
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "carrito_id")
    private Carrito carrito;

    private Integer cantidad; // Very important for your stock logic!
}