package com.uade.tpo.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Data;



// Entidad Imagen: archivo binario asociado a un producto o a un perfil (excluyentes)
@Data
@Entity
public class Imagen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String extension; // e.g., "png", "jpg"

    // Contenido binario de la imagen; se guarda como BLOB y no se expone en las respuestas JSON (solo lectura de la BD)
    @Lob
    @Basic(fetch = FetchType.LAZY) // This prevents loading the image until you actually call getData()
    @Column(columnDefinition = "LONGBLOB")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private byte[] data;

    // Producto al que pertenece (si es una imagen de producto)
    @ManyToOne
    @JoinColumn(name = "producto_id")
    @JsonIgnore
    private Producto producto;

    // Perfil al que pertenece (si es una foto de perfil)
    @OneToOne
    @JoinColumn(name = "perfil_id")
    @JsonIgnore
    private Perfil perfil;
}
