package com.uade.tpo.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

// Entidad Perfil: datos personales del usuario (nombre, dni, contacto), separados de las credenciales
@Data
@Entity
@Table(name = "perfiles")
public class Perfil {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String nombre;
  private String apellido;
  private String dni;
  private String telefono;
  private String direccion;

  // Usuario dueño de este perfil (relación uno a uno obligatoria)
  @OneToOne
  @JoinColumn(name = "usuario_id", nullable = false, unique = true)
  private Usuario usuario;
}
