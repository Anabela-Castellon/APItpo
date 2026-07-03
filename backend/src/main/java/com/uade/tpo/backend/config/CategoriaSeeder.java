package com.uade.tpo.backend.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.uade.tpo.backend.model.Categoria;
import com.uade.tpo.backend.repository.CategoriaRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CategoriaSeeder implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;

    private static final List<String> CATEGORIAS_BASE = List.of(
            "Panificados", "Tortas", "Cafés", "Bebidas", "Combos", "Promos");

    @Override
    public void run(String... args) {
        for (String nombre : CATEGORIAS_BASE) {
            if (categoriaRepository.findByNombre(nombre).isEmpty()) {
                Categoria categoria = new Categoria();
                categoria.setNombre(nombre);
                categoriaRepository.save(categoria);
            }
        }
    }
}
