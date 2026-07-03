package com.uade.tpo.backend.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

// Entidad Categoria: clasifica productos (ej: Tortas, Bebidas). Relación muchos a muchos con Producto
@Data
@Entity
@Table(name = "categorias")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    // Lado inverso de la relación (no se serializa para evitar referencias circulares en el JSON)
    @JsonIgnore
    @ManyToMany(mappedBy = "categorias", fetch = FetchType.LAZY)
    private List<Producto> productos = new ArrayList<>();
}
