package com.uade.tpo.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.backend.model.Usuario;


// Acceso a datos de Usuario
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    //findAll() ya está implementado por JpaRepository, no es necesario definirlo aquí
    // select * from usuario
    // Busca un usuario por email (usado para login y para cargar el UserDetails)
    Optional<Usuario> findByEmail(String email);
    // Verifica si ya existe un usuario con ese email (usado para evitar duplicados al registrar)
    boolean existsByEmail(String email);
}
