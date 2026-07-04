// src/components/CartRedux.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCartItems,
  addProductoToCart,
  removeProductoFromCart,
} from '../store/cartSlice';

// Versión simplificada/alternativa del carrito, usada en la ruta de prueba /cart-redux
const CartRedux = () => {
  const dispatch = useDispatch();
  const { items, total, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  if (loading) return <p>Cargando carrito...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Carrito (Redux)</h1>

      {items.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
              <span>{item.producto?.nombre}</span>
              <span>x{item.cantidad}</span>
              <button onClick={() => dispatch(removeProductoFromCart(item.producto.id))}>
                Eliminar
              </button>
            </div>
          ))}
          <h3>Total: ${total?.toLocaleString('es-AR')}</h3>
        </>
      )}
    </div>
  );
};

export default CartRedux;
