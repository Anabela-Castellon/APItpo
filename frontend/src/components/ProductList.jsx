// Ruta: src/components/ProductList.jsx
//
// Muestra el catálogo completo de productos.
// Hace un fetch a la API cuando carga la pantalla y guarda los productos en estado.
// Cada producto tiene un botón "Agregar al Carrito" que usa Redux para pegarle al endpoint.
 
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// Eliminamos useCart e importamos Redux
import { useDispatch } from 'react-redux';
import { addProductoToCart } from '../store/cartSlice';
 
const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
 
  // Inicializamos dispatch
  const dispatch = useDispatch();
 
  // useEffect con array vacío [] = se ejecuta una sola vez cuando carga el componente
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = localStorage.getItem('token');
 
        // Si hay token lo mandamos en el header, si no hacemos el pedido sin auth
        const response = await fetch('http://localhost:8080/api/productos', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
 
        if (response.ok) {
          const data = await response.json();
          setProductos(data);
        }
      } catch (error) {
        console.error('Error fetching productos:', error);
      } finally {
        // Pase lo que pase, dejamos de mostrar el loading
        setCargando(false);
      }
    };
 
    fetchProductos();
  }, []);
 
  if (cargando) return <h2>Cargando productos...</h2>;
 
  return (
    <div>
      <h2>Catálogo de Productos</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {productos.length > 0 ? (
          productos.map(prod => (
            <div
              key={prod.id}
              style={{
                border: '1px solid #ccc',
                padding: '15px',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {/* El título es clickeable y lleva al detalle del producto */}
              <Link to={`/producto/${prod.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ cursor: 'pointer', margin: '0 0 10px 0' }}>{prod.nombre}</h3>
              </Link>
 
              <p>{prod.descripcion}</p>
              <p style={{ fontWeight: 'bold', marginTop: 'auto', paddingTop: '10px' }}>${prod.precio}</p>
 
              <Link
                to={`/producto/${prod.id}`}
                style={{ margin: '10px 0', fontSize: '14px', color: '#aa3bff', textDecoration: 'none', fontWeight: 'bold' }}
              >
                Ver detalles →
              </Link>
 
              {/* Al hacer click despachamos la acción de Redux con el id del producto y cantidad 1 */}
              <button
                onClick={() => dispatch(addProductoToCart({ productoId: prod.id, cantidad: 1 }))}
                style={{
                  cursor: 'pointer',
                  padding: '8px',
                  background: '#aa3bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px'
                }}
              >
                Agregar al Carrito
              </button>
            </div>
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>
    </div>
  );
};
 
export default ProductList;