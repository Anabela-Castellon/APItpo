package com.uade.tpo.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.backend.model.Categoria;
import com.uade.tpo.backend.repository.CategoriaRepository;

import jakarta.transaction.Transactional;

// CRUD de categorías
@Service
@Transactional
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    // Devuelve todas las categorías
    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();
    }

    // Busca una categoría por id, o lanza error si no existe
    public Categoria getCategoriaById(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada con id: " + id));
    }

    // Crea o actualiza (save) una categoría
    public Categoria saveCategoria(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    // Elimina una categoría por id
    public void deleteCategoria(Long id) {
        categoriaRepository.deleteById(id);
    }
}