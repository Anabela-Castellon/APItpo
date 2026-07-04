package com.uade.tpo.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.backend.model.ClaveMaestra;

// Acceso a datos de ClaveMaestra (en la práctica solo existe un registro)
@Repository
public interface ClaveMaestraRepository extends JpaRepository<ClaveMaestra, Long> {
}
