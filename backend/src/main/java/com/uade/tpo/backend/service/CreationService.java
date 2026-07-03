package com.uade.tpo.backend.service;
 
import java.util.Set;
import java.util.stream.Collectors;
 
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
 
import com.uade.tpo.backend.dto.LoginRequest;
import com.uade.tpo.backend.dto.RegistrationRequestDTO;
import com.uade.tpo.backend.exception.EmailAlreadyExistsException;
import com.uade.tpo.backend.exception.InvalidClaveMaestraException;
import com.uade.tpo.backend.model.Carrito;
import com.uade.tpo.backend.model.Perfil;
import com.uade.tpo.backend.model.Rol;
import com.uade.tpo.backend.model.Usuario;
import com.uade.tpo.backend.repository.ClaveMaestraRepository;
import com.uade.tpo.backend.repository.UsuarioRepository;
import com.uade.tpo.backend.security.JwtUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class CreationService {

    private final UsuarioRepository usuarioRepository;
    private final ClaveMaestraRepository claveMaestraRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public String register(RegistrationRequestDTO request) {
        return registerWithRole(request, Rol.CONSUMIDOR);
    }

    public String registerVendedor(RegistrationRequestDTO request) {
        return registerWithRole(request, Rol.VENDEDOR);
    }

    public String registerAdmin(RegistrationRequestDTO request) {
        String clave = request.getClaveMaestra() == null ? "" : request.getClaveMaestra();
        boolean claveValida = claveMaestraRepository.findAll().stream()
                .anyMatch(c -> passwordEncoder.matches(clave, c.getValorHash()));
        if (!claveValida) {
            throw new InvalidClaveMaestraException();
        }
        return registerWithRole(request, Rol.ADMIN);
    }

    /**
     * Lógica centralizada para crear usuarios con sus dependencias en cascada.
     */
    private String registerWithRole(RegistrationRequestDTO request, Rol rol) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }
 
        // 1. Crear usuario
        Usuario usuario = Usuario.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) 
                .rol(rol)
                .build();
 
        // 2. Crear Perfil y establecer relación bidireccional
        Perfil perfil = new Perfil();
        perfil.setNombre(request.getNombre());
        perfil.setApellido(request.getApellido());
        perfil.setDni(request.getDni());
        perfil.setTelefono(request.getTelefono());
        perfil.setDireccion(request.getDireccion());
        
        perfil.setUsuario(usuario);
        usuario.setPerfil(perfil);
 
        // 3. Crear Carrito SOLO si el usuario es un CONSUMIDOR
        if (rol == Rol.CONSUMIDOR) {
            Carrito carrito = new Carrito();
            carrito.setPrecioTotal(0.0);
            
            carrito.setUsuario(usuario);
            usuario.setCarrito(carrito);
        }
 
        // 4. PERSISTENCIA EN CASCADA: Un solo save guarda el Usuario, su Perfil y su Carrito (si aplica).
        usuarioRepository.save(usuario);
 
        // 5. Generar token JWT
        Set<String> roles = usuario.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .collect(Collectors.toSet());
 
        return jwtUtil.generateToken(usuario.getEmail(), roles);
    }
 
    public String authenticate(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassworld()
                )
        );
 
        Usuario user = usuarioRepository.findByEmail(request.getEmail()).orElseThrow();
 
        Set<String> roles = user.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .collect(Collectors.toSet());
 
        return jwtUtil.generateToken(user.getEmail(), roles);
    }
}
