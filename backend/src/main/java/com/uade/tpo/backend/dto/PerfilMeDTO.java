package com.uade.tpo.backend.dto;

import lombok.Data;

@Data
public class PerfilMeDTO {
  private Long id;
  private String nombre;
  private String apellido;
  private String telefono;
  private String direccion;
  private String email;
}
