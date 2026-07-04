package com.uade.tpo.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.uade.tpo.backend.model.ClaveMaestra;
import com.uade.tpo.backend.repository.ClaveMaestraRepository;

import lombok.RequiredArgsConstructor;

// Se ejecuta al arrancar la app para asegurar que exista una clave maestra (usada al registrar ADMIN)
@Component
@RequiredArgsConstructor
public class ClaveMaestraSeeder implements CommandLineRunner {

    // Valor por defecto de la clave maestra (se guarda hasheada, nunca en texto plano)
    private static final String CLAVE_MAESTRA_DEFAULT = "AniTomiVaniDeniJuanUADE2026.admin";

    private final ClaveMaestraRepository claveMaestraRepository;
    private final PasswordEncoder passwordEncoder;

    // Busca la clave maestra existente (o crea una nueva) y guarda su hash en la BD
    @Override
    public void run(String... args) {
        ClaveMaestra clave = claveMaestraRepository.findAll().stream().findFirst().orElseGet(ClaveMaestra::new);
        clave.setValorHash(passwordEncoder.encode(CLAVE_MAESTRA_DEFAULT));
        claveMaestraRepository.save(clave);
    }
}
