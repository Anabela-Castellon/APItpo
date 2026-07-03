package com.uade.tpo.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.backend.model.Categoria;

// Acceso a datos de Categoria
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    // Busca una categoría por nombre (usado por el seeder para evitar duplicados)
    Optional<Categoria> findByNombre(String nombre);
}
