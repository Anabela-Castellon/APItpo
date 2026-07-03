package com.uade.tpo.backend.controller;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.uade.tpo.backend.model.Imagen;
import com.uade.tpo.backend.service.ImagenService;

@RestController
@RequestMapping("/api")
public class ImagenController {

    @Autowired
    private ImagenService imagenService;

    // URL: POST http://localhost:8080/api/productos/1/imagenes
    @PostMapping("productos/{productoId}/imagenes")
    public ResponseEntity<Imagen> uploadImagenProducto(
            @RequestParam("file") MultipartFile file,
            @PathVariable Long productoId) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(imagenService.uploadImagenProducto(file, productoId));
    }

    @PostMapping("perfiles/{perfilId}/imagenes")
    public ResponseEntity<Imagen> uploadImagenPerfil(
            @RequestParam("file") MultipartFile file,
            @PathVariable Long perfilId) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(imagenService.uploadImagenPerfil(file, perfilId));
    }

    // URL: GET http://localhost:8080/api/productos/1/imagenes/1
    @GetMapping("productos/{productoId}/imagenes/{id}")
    public ResponseEntity<byte[]> getImagen(
            @PathVariable Long productoId, // Path variable for consistency
            @PathVariable Long id) {

        // We still use the service to get the image by its unique ID
        Imagen img = imagenService.getImagen(id);

        // Optional: Logic to verify the image actually belongs to the product
        if (!img.getProducto().getId().equals(productoId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(img.getExtension()))
                .body(img.getData());
    }

    @GetMapping("/perfiles/{perfilId}/imagenes/{id}")
    public ResponseEntity<byte[]> getImagenA(
            @PathVariable Long perfilId, // Path variable for consistency
            @PathVariable Long id) {

        // We still use the service to get the image by its unique ID
        Imagen img = imagenService.getImagen(id);

        // Optional: Logic to verify the image actually belongs to the product
        if (!img.getPerfil().getId().equals(perfilId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(img.getExtension()))
                .body(img.getData());
    }
    /* 
    @PutMapping("/{productoId}/imagenes/{id}")
    public ResponseEntity<Imagen> updateImagen(
            @PathVariable Long productoId,
            @PathVariable Long id,
            @RequestBody String nuevoNombre) {
        // Basic validation to ensure the image belongs to the product
        Imagen img = imagenService.getImagen(id);
        if (!img.getProducto().getId().equals(productoId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(imagenService.updateImagenNombre(id, nuevoNombre));
    }
    */

    @PutMapping("productos/{productoId}/imagenes/{id}")
    public ResponseEntity<Imagen> updateImagenProducto(
            @PathVariable Long productoId,
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        
        Imagen img = imagenService.getImagen(id);
        
        // Validación de seguridad: ¿la imagen pertenece a ese producto?
        if (img.getProducto() == null || !img.getProducto().getId().equals(productoId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(imagenService.updateImagenFile(id, file));
    }

    @PutMapping("perfiles/{perfilId}/imagenes/{id}")
    public ResponseEntity<Imagen> updateImagenPerfil(
            @PathVariable Long perfilId,
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        
        Imagen img = imagenService.getImagen(id);
        
        // Validación: ¿la imagen pertenece a ese perfil?
        if (img.getPerfil() == null || !img.getPerfil().getId().equals(perfilId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(imagenService.updateImagenFile(id, file));
    }
    
    // URL: DELETE http://localhost:8080/api/productos/1/imagenes/1
    @DeleteMapping("productos/{productoId}/imagenes/{id}")
    public ResponseEntity<?> deleteImagen(
            @PathVariable Long productoId,
            @PathVariable Long id) {

        Imagen img = imagenService.getImagen(id);
        if(!img.getProducto().getId().equals(productoId))  {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        imagenService.deleteImagen(id);
        return ResponseEntity.noContent().build();
    }
}