import { StrictMode } from "react";
import { createRoot } from "react-dom/client";


import App from "./App.jsx";

// Actualizamos las rutas para que apunten a la nueva carpeta styles/
import "./styles/variables.css"; 
import "./styles/index.css"; 

// Punto de entrada: monta la app React en el div#root del index.html
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);