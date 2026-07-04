package com.uade.tpo.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.backend.model.Consulta;

// Acceso a datos de Consulta
@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    // Lista todas las consultas ordenadas de la más reciente a la más antigua
    List<Consulta> findAllByOrderByFechaEnvioDesc();
}
