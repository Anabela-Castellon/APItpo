package com.uade.tpo.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

// Entidad que guarda el hash de la clave maestra requerida para registrar usuarios ADMIN
@Data
@Entity
public class ClaveMaestra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Hash (BCrypt) de la clave maestra, nunca se guarda en texto plano
    private String valorHash;
}
