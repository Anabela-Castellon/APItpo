package com.uade.tpo.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.backend.model.Carrito;

// Acceso a datos de Carrito; hereda CRUD básico (findAll, findById, save, delete) de JpaRepository
@Repository
public interface CarritoRepository  extends JpaRepository<Carrito, Long> {
    //findAll() ya está implementado por JpaRepository, no es necesario definirlo aquí
    // select * from productos
}
