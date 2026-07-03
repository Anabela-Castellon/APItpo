package com.uade.tpo.backend.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

// Entidad Producto: catálogo de la tienda, con precio, stock, categorías e imágenes
@Data
@Entity
@Table(name = "productos")
public class Producto {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String nombre;

  private String descripcion;

  @Column(nullable = false)
  private Double precio;

  // Unidades disponibles; se descuenta en el checkout del carrito
  private Integer stock;

  // Relación muchos a muchos con Categoria a través de tabla intermedia
  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(name = "productos_categorias", joinColumns = @JoinColumn(name = "producto_id"), inverseJoinColumns = @JoinColumn(name = "categoria_id"))
  private List<Categoria> categorias = new ArrayList<>();


  // Un producto puede tener varias imágenes; se borran en cascada junto con el producto
  // Relational Upgrade: One product has many images
  @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Imagen> imagenes;
}
