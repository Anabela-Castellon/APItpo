package com.uade.tpo.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.backend.exception.ResourceNotFoundException;
import com.uade.tpo.backend.model.Consulta;
import com.uade.tpo.backend.model.EstadoConsulta;
import com.uade.tpo.backend.repository.ConsultaRepository;

import jakarta.transaction.Transactional;

// Lógica de negocio de las consultas del formulario de contacto
@Service
@Transactional
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;

    // Crea una consulta nueva: ignora el id recibido, setea fecha actual y estado inicial PENDIENTE
    public Consulta crearConsulta(Consulta consulta) {
        consulta.setId(null);
        consulta.setFechaEnvio(LocalDateTime.now());
        consulta.setEstado(EstadoConsulta.PENDIENTE);
        return consultaRepository.save(consulta);
    }

    // Lista todas las consultas, de la más nueva a la más vieja
    public List<Consulta> getAllConsultas() {
        return consultaRepository.findAllByOrderByFechaEnvioDesc();
    }

    // Busca una consulta por id, o lanza error si no existe
    public Consulta getConsultaById(Long id) {
        return consultaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consulta no encontrada con id: " + id));
    }

    // Cambia el estado de una consulta (ej: de PENDIENTE a RESPONDIDA)
    public Consulta actualizarEstado(Long id, EstadoConsulta nuevoEstado) {
        Consulta consulta = getConsultaById(id);
        consulta.setEstado(nuevoEstado);
        return consultaRepository.save(consulta);
    }
}
