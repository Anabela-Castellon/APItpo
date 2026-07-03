// Ruta: src/pages/Checkout.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkoutCart } from '../store/cartSlice';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems, total, loading, error } = useSelector((state) => state.cart);
  const [confirmando, setConfirmando] = useState(false);

  const handleConfirmar = async () => {
    setConfirmando(true);
    const result = await dispatch(checkoutCart());
    setConfirmando(false);
    if (checkoutCart.fulfilled.match(result)) {
      alert('¡Compra confirmada!');
      navigate('/');
    } else {
      alert(result.payload || 'No se pudo confirmar la compra');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1>Confirmar Compra</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {cartItems.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <div style={{ marginBottom: '1.5rem' }}>
          <h2>Resumen del pedido</h2>

          {cartItems.map(item => {
            const producto = item.producto || item;
            const cantidad = item.cantidad || item.quantity || 1;
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #eee'
                }}
              >
                <span>{producto.nombre} x{cantidad}</span>
                <span style={{ fontWeight: 'bold' }}>
                  ${((producto.precio || 0) * cantidad).toLocaleString('es-AR')}
                </span>
              </div>
            );
          })}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '1rem 0',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            <span>Total:</span>
            <span>${(total || 0).toLocaleString('es-AR')}</span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link
          to="/cart"
          style={{
            backgroundColor: '#333',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            textDecoration: 'none'
          }}
        >
          Volver al carrito
        </Link>

        {cartItems.length > 0 && (
          <button
            onClick={handleConfirmar}
            disabled={confirmando || loading}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: confirmando ? 'not-allowed' : 'pointer'
            }}
          >
            {confirmando ? 'Confirmando...' : 'Confirmar compra'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Checkout;
