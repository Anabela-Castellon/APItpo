package com.uade.tpo.backend.repository;

import com.uade.tpo.backend.model.Imagen;
import org.springframework.data.jpa.repository.JpaRepository;

// Acceso a datos de Imagen
public interface ImagenRepository extends JpaRepository<Imagen, Long> {
}
