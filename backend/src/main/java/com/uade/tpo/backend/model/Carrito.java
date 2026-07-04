package com.uade.tpo.backend.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;
import lombok.Data;

// Entidad Carrito: cada usuario CONSUMIDOR tiene uno propio con sus items y el total
@Data
@Entity
@Table(name = "carritos")
public class Carrito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Suma de precio*cantidad de todos los items (se recalcula en CarritoService)
    @Column(nullable = false)
    private Double precioTotal;

    // Items del carrito; si se borra el carrito o se quita un item, se borra en cascada
    @JsonManagedReference
    @OneToMany(mappedBy = "carrito", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemCarrito> productos = new ArrayList<>();

    // Dueño del carrito (relación uno a uno)
    @OneToOne
    @JoinColumn(name = "usuario", referencedColumnName = "id")
    @JsonIgnore // Prevent circular reference in JSON
    private Usuario usuario;
}