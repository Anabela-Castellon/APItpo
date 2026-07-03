package com.uade.tpo.backend.controller;
 
import java.util.List;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
 
import com.uade.tpo.backend.model.Usuario;
import com.uade.tpo.backend.service.UsuarioService;
 
// Controlador de gestión de usuarios (listar, ver, eliminar, dar de alta/baja): todo restringido a ADMIN
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
 
  @Autowired
  private UsuarioService usuarioService;
 
  // GET /api/usuarios  →  solo ADMIN (lo protege SecurityConfig)
  @GetMapping
  public List<Usuario> getAllUsuarios() {
    return usuarioService.getAllUsuarios();
  }
 
  // GET /api/usuarios/1
  @GetMapping("/{id}")
  public ResponseEntity<?> obtenerUsuarioPorId(@PathVariable Long id) {
    try {
      Usuario usuario = usuarioService.obtenerUsuarioPorId(id);
      return ResponseEntity.ok(usuario);
    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body("Usuario no encontrado con ID: " + id);
    }
  }
 
  // DELETE /api/usuarios/1
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
    usuarioService.deleteUsuario(id);
    return ResponseEntity.noContent().build();
  }
  
  // Reactiva a un usuario dado de baja
  // PUT /api/usuarios/1/dar-de-alta
    @PutMapping("/{id}/alta")
    public ResponseEntity<String> darDeAlta(@PathVariable Long id) {
        try {
            usuarioService.darDeAltaUsuario(id);
            return ResponseEntity.ok("Usuario activado correctamente.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Deshabilita a un usuario (queda "dado de baja", no puede loguearse)
    // PUT /api/usuarios/1/dar-de-baja
    @PutMapping("/{id}/baja")
    public ResponseEntity<String> darDeBaja(@PathVariable Long id) {
        try {
            usuarioService.darDeBajaUsuario(id);
            return ResponseEntity.ok("Usuario dado de baja correctamente.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
  // NOTA: registro y login ahora están en AuthenticationController (/api/auth/register y /api/auth/login)
}