package com.uade.tpo.backend.dto;
 
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

// DTO que recibe las credenciales del body en el login (POST /api/auth/login)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class LoginRequest {
    private String email;

    // El JSON del frontend manda la clave como "contraseña"; Jackson la mapea a este campo
    @JsonProperty("contraseña")
    private String passworld;
}