package com.uade.tpo.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Clase principal: punto de entrada de la aplicación Spring Boot
@SpringBootApplication
public class backendApplication {

	// Arranca el servidor y todo el contexto de Spring (beans, seguridad, etc.)
	public static void main(String[] args) {
		SpringApplication.run(backendApplication.class, args);
	}

}
