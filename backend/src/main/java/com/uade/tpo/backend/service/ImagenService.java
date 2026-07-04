package com.uade.tpo.backend.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.uade.tpo.backend.model.Imagen;
import com.uade.tpo.backend.model.Perfil;
import com.uade.tpo.backend.model.Producto;
import com.uade.tpo.backend.repository.ImagenRepository;
import com.uade.tpo.backend.repository.PerfilRepository;
import com.uade.tpo.backend.repository.ProductoRepository;

import jakarta.transaction.Transactional;

// Lógica de negocio para subir, leer, actualizar y borrar imágenes de productos y perfiles
@Service
@Transactional
public class ImagenService {

    @Autowired
    private ImagenRepository imagenRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private PerfilRepository perfilRepository;

    // Guarda una nueva imagen asociada a un producto (lee los bytes del archivo subido)
    public Imagen uploadImagenProducto(MultipartFile file, Long productoId) throws IOException {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Imagen imagen = new Imagen();
        imagen.setNombre(file.getOriginalFilename());
        imagen.setExtension(file.getContentType());
        imagen.setData(file.getBytes());
        imagen.setProducto(producto);

        return imagenRepository.save(imagen);
    }

    // Guarda una nueva imagen asociada a un perfil (foto de usuario)
    public Imagen uploadImagenPerfil(MultipartFile file, Long perfilId) throws IOException {
        Perfil perfil = perfilRepository.findById(perfilId)
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));
        Imagen imagen = new Imagen();
        imagen.setNombre(file.getOriginalFilename());
        imagen.setExtension(file.getContentType());
        imagen.setData(file.getBytes());
        imagen.setPerfil(perfil);

        return imagenRepository.save(imagen);
    }

    // Busca una imagen por id (incluye sus bytes), o lanza error si no existe
    public Imagen getImagen(Long id) {
        return imagenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Imagen no encontrada"));
    }

    // Cambia solo el nombre de una imagen existente (no usado actualmente por el controller)
    public Imagen updateImagenNombre(Long id, String nuevoNombre) {
        return imagenRepository.findById(id).map(imagen -> {
            imagen.setNombre(nuevoNombre);
            return imagenRepository.save(imagen);
        }).orElseThrow(() -> new RuntimeException("Imagen no encontrada"));
    }

    // Reemplaza el archivo (nombre, extensión y contenido) de una imagen existente
    public Imagen updateImagenFile(Long id, MultipartFile file) throws IOException {
    Imagen imagen = getImagen(id); // Reutiliza tu método existente

    imagen.setNombre(file.getOriginalFilename());
    imagen.setExtension(file.getContentType());
    imagen.setData(file.getBytes());

    return imagenRepository.save(imagen);
    }

    // Elimina una imagen por id
    public void deleteImagen(Long id) {
        if (!imagenRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado");
        }
        imagenRepository.deleteById(id);
    }
}