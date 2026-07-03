import { useState } from 'react';
import { getImagenUrl } from '../../services/api';

// Muestra la imagen de un producto desde la API; si no hay imagen o falla la carga, muestra un placeholder
const ProductImage = ({ productoId, imagenId, alt, className }) => {
  const [error, setError] = useState(false);

  if (!imagenId || error) {
    return <div className={`${className} admin-img-placeholder`} aria-hidden="true">🎂</div>;
  }

  return (
    <img
      src={getImagenUrl(productoId, imagenId)}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};

export default ProductImage;
