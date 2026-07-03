package com.uade.tpo.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.backend.model.Perfil;

// Acceso a datos de Perfil
public interface PerfilRepository extends JpaRepository<Perfil, Long> {
    // Busca el perfil a partir del id del usuario dueño
    Optional<Perfil> findByUsuarioId(Long usuarioId);
}