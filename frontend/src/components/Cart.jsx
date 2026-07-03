// Ruta: src/components/Cart.jsx

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchCartItems, 
  addProductoToCart, 
  removeProductoFromCart 
} from '../store/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  
  const { items: cartItems, total, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  // Agregamos 'maxStock' como parámetro para validar antes de enviar a la API
  const handleUpdateQuantity = (productoId, currentQuantity, newQuantity, maxStock) => {
    if (newQuantity <= 0) {
      dispatch(removeProductoFromCart(productoId));
    } else if (maxStock !== undefined && newQuantity > maxStock) {
      // Si la nueva cantidad supera el stock, bloqueamos la ejecución
      return;
    } else {
      const delta = newQuantity - currentQuantity;
      dispatch(addProductoToCart({ productoId, cantidad: delta }));
    }
  };

  if (loading && cartItems.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.2rem' }}>
        Cargando carrito...
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Carrito de Compras</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          Error al actualizar el carrito: {error}
        </div>
      )}
 
      {cartItems.length > 0 && (
        <p>Tenés {cartItems.length} producto(s) en el carrito</p>
      )}
 
      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>
          <div style={{ marginBottom: '2rem' }}>
            {cartItems.map(item => {
              const productoInfo = item.producto || item;
              const itemQuantity = item.quantity || item.cantidad || 1;
              const productoId = productoInfo.id;
              const precio = productoInfo.precio || 0;
              const subtotal = precio * itemQuantity;
              
              // Extraemos el stock disponible del producto
              const stockDisponible = productoInfo.stock;
              // Determinamos si ya se alcanzó el límite de stock disponible
              const alcanzoLimite = stockDisponible !== undefined && itemQuantity >= stockDisponible;

              return (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto',
                    gap: '1rem',
                    alignItems: 'center',
                    padding: '1rem',
                    borderBottom: '1px solid #eee',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {/* Info del producto */}
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{productoInfo.nombre || 'Producto sin nombre'}</h3>
                    <p style={{ margin: '0', color: '#666' }}>${precio.toLocaleString('es-AR')} c/u</p>
                    {stockDisponible !== undefined && (
                      <p style={{ margin: '0', fontSize: '0.85rem', color: '#888' }}>
                        Disponibles: {stockDisponible} u.
                      </p>
                    )}
                    <p style={{ margin: '0.5rem 0', color: '#ff4444', fontWeight: 'bold' }}>
                      Subtotal: ${subtotal.toLocaleString('es-AR')}
                    </p>
                  </div>
   
                  {/* Botones con control de stock */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      disabled={loading}
                      onClick={() => handleUpdateQuantity(productoId, itemQuantity, itemQuantity - 1, stockDisponible)}
                      style={{ padding: '4px 10px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                      −
                    </button>
                    <span>{itemQuantity}</span>
                    <button
                      disabled={loading || alcanzoLimite} // Se deshabilita si carga o si no hay más stock
                      onClick={() => handleUpdateQuantity(productoId, itemQuantity, itemQuantity + 1, stockDisponible)}
                      title={alcanzoLimite ? "Alcanzaste el stock máximo disponible" : "Agregar uno más"}
                      style={{ 
                        padding: '4px 10px', 
                        cursor: alcanzoLimite ? 'not-allowed' : 'pointer', 
                        borderRadius: '4px', 
                        border: '1px solid #ccc',
                        backgroundColor: alcanzoLimite ? '#eaeaea' : '#fff',
                        color: alcanzoLimite ? '#aaa' : '#000'
                      }}
                    >
                      +
                    </button>
                  </div>
   
                  <button
                    disabled={loading}
                    onClick={() => dispatch(removeProductoFromCart(productoId))}
                    style={{
                      padding: '0.5rem',
                      background: 'none',
                      border: '1px solid #ff4444',
                      color: '#ff4444',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              );
            })}
          </div>
 
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '1rem',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
            marginBottom: '1rem',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            Total: ${(total || 0).toLocaleString('es-AR')}
          </div>
        </>
      )}
 
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link
          to="/"
          style={{
            backgroundColor: '#333',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          Seguir comprando
        </Link>
 
        {cartItems.length > 0 && (
          <Link
            to="/checkout"
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            Pagar
          </Link>
        )}
      </div>
    </div>
  );
};
 
export default Cart;