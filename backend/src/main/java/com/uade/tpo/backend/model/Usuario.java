package com.uade.tpo.backend.model;
 
import java.util.Collection;
import java.util.List;
 
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
 
import com.fasterxml.jackson.annotation.JsonIgnore;
 
import jakarta.persistence.*;
import lombok.*;
 
// Entidad Usuario: credenciales y rol. Implementa UserDetails para integrarse con Spring Security
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    // La contraseña se llama "password" para que Spring Security la encuentre automáticamente
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Rol rol;

    // Flags de estado de la cuenta (banderas de UserDetails)
    @Builder.Default
    private boolean usuarioExpirado = true;

    @Builder.Default
    private boolean cuentaBloqueada = true;

    // Si es false, el usuario fue "dado de baja" y no puede loguearse (ver isEnabled)
    @Builder.Default
    private boolean dadoDeAlta = true;

    // Perfil con datos personales del usuario (uno a uno, se borra en cascada)
    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL)
    @JsonIgnore
    private Perfil perfil;



    // Carrito de compras del usuario (uno a uno, se borra en cascada)
    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL)
    @JsonIgnore
    private Carrito carrito;

    // --- Métodos de UserDetails (requeridos por Spring Security) ---

    // Rol convertido al formato "ROLE_X" que espera Spring Security para autorizar
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + (rol != null ? rol.name() : "CONSUMIDOR")));
    }

    // Spring Security usa getUsername() para identificar al usuario → devolvemos el email
    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired()     { return usuarioExpirado; }

    @Override
    public boolean isAccountNonLocked()      { return cuentaBloqueada; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    // Controla si el usuario puede loguearse (false = dado de baja)
    @Override
    public boolean isEnabled()               { return dadoDeAlta; }
}