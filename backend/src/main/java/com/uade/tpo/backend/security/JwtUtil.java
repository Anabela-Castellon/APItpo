package com.uade.tpo.backend.security;
 
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
 
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Set;
 
// Utilidad para generar y validar tokens JWT (firma, expiración, extracción de datos)
@Component
public class JwtUtil {

    // Clave secreta para firmar los tokens (definida en application.properties)
    @Value("${jwt.secret}")
    private String secret;

    // Tiempo de vida del token en milisegundos
    @Value("${jwt.expiration}")
    private Long expiration;

    // Construye la clave de firma HMAC a partir del secreto
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Genera un token firmado con el email del usuario y sus roles, con fecha de expiración
    public String generateToken(String username, Set<String> roles) {
        return Jwts.builder()
                .setSubject(username)
                .claim("roles", String.join(",", roles))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Extrae el username (email) desde el token
    public String getUsername(String token) {
        return getClaims(token).getSubject();
    }

    // Extrae los roles guardados en el token
    public Set<String> getRoles(String token) {
        String roles = (String) getClaims(token).get("roles");
        return Set.of(roles.split(","));
    }

    // Verifica que el token sea válido (firma correcta y no expirado)
    public boolean validateToken(String token) {
        try {
            Claims claims = getClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    // Parsea el token y devuelve sus claims (payload), validando la firma
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}