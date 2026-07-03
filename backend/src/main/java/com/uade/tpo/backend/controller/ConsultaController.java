package com.uade.tpo.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.backend.model.Consulta;
import com.uade.tpo.backend.model.EstadoConsulta;
import com.uade.tpo.backend.service.ConsultaService;

@RestController
@RequestMapping("/api/consultas")
public class ConsultaController {

    @Autowired
    private ConsultaService consultaService;

    // POST /api/consultas -> crear consulta (público, formulario de contacto)
    @PostMapping
    public ResponseEntity<Consulta> crearConsulta(@RequestBody Consulta consulta) {
        return ResponseEntity.status(HttpStatus.CREATED).body(consultaService.crearConsulta(consulta));
    }

    // GET /api/consultas -> listar todas (solo ADMIN)
    @GetMapping
    public List<Consulta> getAllConsultas() {
        return consultaService.getAllConsultas();
    }

    // GET /api/consultas/1 -> detalle (solo ADMIN)
    @GetMapping("/{id}")
    public Consulta getConsultaById(@PathVariable Long id) {
        return consultaService.getConsultaById(id);
    }

    // PUT /api/consultas/1/estado -> actualizar estado (solo ADMIN)
    @PutMapping("/{id}/estado")
    public Consulta actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        EstadoConsulta nuevoEstado = EstadoConsulta.valueOf(body.get("estado"));
        return consultaService.actualizarEstado(id, nuevoEstado);
    }
}
