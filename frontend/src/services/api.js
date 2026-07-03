// src/services/api.js
const BASE_URL = 'http://localhost:8080/api';

// Arma el header Authorization con el token guardado en localStorage (si existe)
const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch genérico para JSON: agrega el token, tira error si la respuesta no es ok, y parsea JSON o texto
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => 'Error en la petición');
    throw new Error(msg || `Error ${res.status}`);
  }

  const text = await res.text();
  if (!text) return null;

  const contentType = res.headers.get('content-type') || '';
  return contentType.includes('application/json') ? JSON.parse(text) : text;
}

// Fetch específico para subir archivos (FormData); no fija Content-Type para que el browser ponga el boundary
export async function apiUpload(path, formData, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    ...options,
    headers: { ...authHeader(), ...options.headers },
    body: formData,
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => 'Error al subir el archivo');
    throw new Error(msg || `Error ${res.status}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Arma la URL para pedir/mostrar (<img src=...>) la imagen de un producto
export function getImagenUrl(productoId, imagenId) {
  return `${BASE_URL}/productos/${productoId}/imagenes/${imagenId}`;
}

// Decodifica el payload del JWT (sin validar firma) para extraer los roles del usuario
export function getRolesFromToken(token) {
  if (!token) return [];
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return (payload.roles || '').split(',').filter(Boolean);
  } catch {
    return [];
  }
}

export default BASE_URL;
