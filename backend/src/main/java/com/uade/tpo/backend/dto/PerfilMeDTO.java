package com.uade.tpo.backend.dto;

import lombok.Data;

// DTO usado para ver/editar el perfil propio del usuario autenticado (endpoint /me)
@Data
public class PerfilMeDTO {
  private Long id;
  private String nombre;
  private String apellido;
  private String telefono;
  private String direccion;
  private String email;
}
