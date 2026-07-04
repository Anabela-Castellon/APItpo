package com.uade.tpo.backend.dto;

import lombok.Data;

// DTO de salida para exponer un perfil sin datos sensibles ni relaciones completas de Usuario
@Data
public class PerfilResponseDTO {

  private Long id;
  private String nombreCompleto;
  private String telefono;
  private String direccion;
  private String fechaNacimiento;

  private Long usuarioId;
  private String nombreUsuario;
}
