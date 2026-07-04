package com.uade.tpo.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.backend.dto.PerfilMeDTO;
import com.uade.tpo.backend.dto.PerfilResponseDTO;
import com.uade.tpo.backend.model.Perfil;
import com.uade.tpo.backend.model.Usuario;
import com.uade.tpo.backend.repository.PerfilRepository;
import com.uade.tpo.backend.repository.UsuarioRepository;

// Lógica de negocio de perfiles: CRUD y conversión a DTOs para exponer datos de forma segura
@Service
public class PerfilService {

  @Autowired
  private PerfilRepository perfilRepository;

  @Autowired
  private UsuarioRepository usuarioRepository;

  // Crea un perfil y lo asocia a un usuario existente
  // CREATE PERFIL //
  public Perfil crearPerfil(Long usuarioId, Perfil perfil) {
    Usuario usuario = usuarioRepository.findById(usuarioId)
        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    perfil.setUsuario(usuario);

    return perfilRepository.save(perfil);
  }

  // Busca un perfil por id y lo devuelve como DTO (con nombre completo armado)
  // GET POR ID (con DTO) //
  public PerfilResponseDTO obtenerPerfilDTO(Long id) {
    Perfil perfil = perfilRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));

    return mapToDTO(perfil);
  }

  // Devuelve todos los perfiles (entidad completa)
  // GET ALL //
  public List<Perfil> obtenerTodos() {
    return perfilRepository.findAll();
  }

  // Actualiza los campos de un perfil existente con los datos recibidos
  // UPDATE //
  public Perfil actualizarPerfil(Long id, Perfil nuevoPerfil) {
    Perfil perfil = perfilRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));

    // Update with the new field names from Perfil.java
    perfil.setNombre(nuevoPerfil.getNombre());
    perfil.setApellido(nuevoPerfil.getApellido());
    perfil.setDni(nuevoPerfil.getDni());
    perfil.setTelefono(nuevoPerfil.getTelefono());
    perfil.setDireccion(nuevoPerfil.getDireccion());
    // Remove setFechaNacimiento if it was removed from Perfil.java

    return perfilRepository.save(perfil);
  }
  // Elimina un perfil por id
  // DELETE //
  public void eliminarPerfil(Long id) {
    if (!perfilRepository.existsById(id)) {
      throw new RuntimeException("Perfil no encontrado");
    }
    perfilRepository.deleteById(id);
  }

  // Busca el perfil a partir del id de usuario (no del id de perfil)
  // GET POR USUARIO (PRO) //
  public PerfilResponseDTO obtenerPerfilPorUsuario(Long usuarioId) {
    Perfil perfil = perfilRepository.findByUsuarioId(usuarioId)
        .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));

    return mapToDTO(perfil);
  }

  // Busca el perfil del usuario autenticado, identificándolo por su email (del token JWT)
  // GET PROPIO (a partir del email del token) //
  public PerfilMeDTO obtenerPerfilPropio(String email) {
    Usuario usuario = usuarioRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    Perfil perfil = perfilRepository.findByUsuarioId(usuario.getId())
        .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));

    return mapToMeDTO(perfil, usuario);
  }

  // Actualiza el perfil del usuario autenticado con los datos recibidos
  // UPDATE PROPIO //
  public PerfilMeDTO actualizarPerfilPropio(String email, PerfilMeDTO datos) {
    Usuario usuario = usuarioRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    Perfil perfil = perfilRepository.findByUsuarioId(usuario.getId())
        .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));

    perfil.setNombre(datos.getNombre());
    perfil.setApellido(datos.getApellido());
    perfil.setTelefono(datos.getTelefono());
    perfil.setDireccion(datos.getDireccion());
    perfilRepository.save(perfil);

    return mapToMeDTO(perfil, usuario);
  }

  // Convierte Perfil + Usuario al DTO usado en los endpoints "/me"
  private PerfilMeDTO mapToMeDTO(Perfil perfil, Usuario usuario) {
    PerfilMeDTO dto = new PerfilMeDTO();
    dto.setId(perfil.getId());
    dto.setNombre(perfil.getNombre());
    dto.setApellido(perfil.getApellido());
    dto.setTelefono(perfil.getTelefono());
    dto.setDireccion(perfil.getDireccion());
    dto.setEmail(usuario.getEmail());
    return dto;
  }

  // Convierte un Perfil al DTO de respuesta pública (combina nombre+apellido, expone email como username)
  private PerfilResponseDTO mapToDTO(Perfil perfil) {
    PerfilResponseDTO dto = new PerfilResponseDTO();
    dto.setId(perfil.getId());
    
    // Combine nombre and apellido for the DTO
    dto.setNombreCompleto(perfil.getNombre() + " " + perfil.getApellido()); 
    dto.setTelefono(perfil.getTelefono());
    dto.setDireccion(perfil.getDireccion());
    
    // Map the relationship and use email as the username
    dto.setUsuarioId(perfil.getUsuario().getId());
    dto.setNombreUsuario(perfil.getUsuario().getEmail()); 

    return dto;
  }
}
