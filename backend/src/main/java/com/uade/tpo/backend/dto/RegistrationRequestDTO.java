package com.uade.tpo.backend.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

// DTO que recibe los datos del formulario de registro (usuario + perfil + clave maestra si es admin)
@Data
public class RegistrationRequestDTO {
    private String email;

    @JsonProperty("contraseña")  // ← esto le dice a Jackson cómo leer el campo del JSON
    private String password;

    private String nombre;
    private String apellido;
    private String dni;
    private String telefono;
    private String direccion;
    private String claveMaestra;
}
