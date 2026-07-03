package com.uade.tpo.backend.service;
 
import java.util.List;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
 
import com.uade.tpo.backend.model.Usuario;
import com.uade.tpo.backend.repository.UsuarioRepository;
 
import jakarta.transaction.Transactional;
 
/**
 * NOTA: El registro y login ahora pasan por AuthenticationService.
 * Este service queda para operaciones admin (listar, buscar, eliminar usuarios).
 */
@Service
@Transactional
public class UsuarioService {
 
    @Autowired
    private UsuarioRepository usuarioRepository;
 
    // Devuelve todos los usuarios
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    // Busca un usuario por id, o lanza error si no existe
    public Usuario obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
    }

    // Elimina un usuario por id
    public void deleteUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    // Deshabilita al usuario (solo si está actualmente habilitado) para que no pueda loguearse más
    public void darDeBajaUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.isEnabled()){
        usuario.setDadoDeAlta(false); // Note: "dar de baja" usually means setting to false
        usuarioRepository.save(usuario);
        }
    }

    // Reactiva al usuario (solo si está actualmente deshabilitado)
    public void darDeAltaUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!usuario.isEnabled()){
        usuario.setDadoDeAlta(true); // Note: "dar de baja" usually means setting to false
        usuarioRepository.save(usuario);
        }
    }
}