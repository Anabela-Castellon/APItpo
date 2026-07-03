package com.uade.tpo.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.backend.dto.PerfilMeDTO;
import com.uade.tpo.backend.model.Perfil;
import com.uade.tpo.backend.service.PerfilService;

@RestController
@RequestMapping("/api/perfiles")
public class PerfilController {

  @Autowired
  private PerfilService perfilService;

  // GET PERFIL POR ID (DTO) //
  @GetMapping("/{id}")
  public ResponseEntity<?> obtenerPerfil(@PathVariable Long id) {
    try {
      return ResponseEntity.ok(
          perfilService.obtenerPerfilDTO(id));
    } catch (RuntimeException e) {
      return ResponseEntity.status(404)
          .body("Perfil no encontrado con ID: " + id);
    }
  }

  // GET ALL PERFILES //
  @GetMapping
  public ResponseEntity<?> getAll() {
    return ResponseEntity.ok(
        perfilService.obtenerTodos());
  }

  // UPDATE PERFIL //
  @PutMapping("/{id}")
  public ResponseEntity<?> update(
      @PathVariable Long id,
      @RequestBody Perfil perfil) {

    perfilService.actualizarPerfil(id, perfil);

    return ResponseEntity.ok(
        perfilService.obtenerPerfilDTO(id));
  }

  // DELETE PERFIL //
  @DeleteMapping("/{id}")
  public ResponseEntity<?> delete(@PathVariable Long id) {
    perfilService.eliminarPerfil(id);
    return ResponseEntity.noContent().build();
  }

  // GET MI PERFIL (a partir del token) //
  @GetMapping("/me")
  public ResponseEntity<?> obtenerMiPerfil(Authentication authentication) {
    try {
      return ResponseEntity.ok(perfilService.obtenerPerfilPropio(authentication.getName()));
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    }
  }

  // UPDATE MI PERFIL //
  @PutMapping("/me")
  public ResponseEntity<?> actualizarMiPerfil(Authentication authentication, @RequestBody PerfilMeDTO datos) {
    try {
      return ResponseEntity.ok(perfilService.actualizarPerfilPropio(authentication.getName(), datos));
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    }
  }

  // GET POR USUARIO (PRO) //
  @GetMapping("/usuario/{id}")
  public ResponseEntity<?> obtenerPerfilPorUsuario(@PathVariable Long id) {
    try {
      return ResponseEntity.ok(
          perfilService.obtenerPerfilPorUsuario(id));
    } catch (RuntimeException e) {
      return ResponseEntity.status(404)
          .body("Perfil no encontrado para el usuario ID: " + id);
    }
  }
}
