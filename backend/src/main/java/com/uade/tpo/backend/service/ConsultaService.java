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

@Service
@Transactional
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;

    public Consulta crearConsulta(Consulta consulta) {
        consulta.setId(null);
        consulta.setFechaEnvio(LocalDateTime.now());
        consulta.setEstado(EstadoConsulta.PENDIENTE);
        return consultaRepository.save(consulta);
    }

    public List<Consulta> getAllConsultas() {
        return consultaRepository.findAllByOrderByFechaEnvioDesc();
    }

    public Consulta getConsultaById(Long id) {
        return consultaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consulta no encontrada con id: " + id));
    }

    public Consulta actualizarEstado(Long id, EstadoConsulta nuevoEstado) {
        Consulta consulta = getConsultaById(id);
        consulta.setEstado(nuevoEstado);
        return consultaRepository.save(consulta);
    }
}
