package com.uade.tpo.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.uade.tpo.backend.model.ClaveMaestra;
import com.uade.tpo.backend.repository.ClaveMaestraRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ClaveMaestraSeeder implements CommandLineRunner {

    private static final String CLAVE_MAESTRA_DEFAULT = "AniTomiVaniDeniJuanUADE2026.admin";

    private final ClaveMaestraRepository claveMaestraRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        ClaveMaestra clave = claveMaestraRepository.findAll().stream().findFirst().orElseGet(ClaveMaestra::new);
        clave.setValorHash(passwordEncoder.encode(CLAVE_MAESTRA_DEFAULT));
        claveMaestraRepository.save(clave);
    }
}
