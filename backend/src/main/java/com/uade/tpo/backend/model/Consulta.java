package com.uade.tpo.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

// Entidad Consulta: mensajes enviados desde el formulario de contacto público
@Data
@Entity
@Table(name = "consultas")
public class Consulta {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String nombre;

  @Column(nullable = false)
  private String email;

  private String asunto;

  @Column(nullable = false, length = 2000)
  private String mensaje;

  @Column(nullable = false)
  private LocalDateTime fechaEnvio;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private EstadoConsulta estado;
}
