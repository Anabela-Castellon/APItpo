// Ruta: src/pages/Checkout.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkoutCart } from '../store/cartSlice';
import '../styles/cart.css';
import '../styles/checkout.css';

// Página de confirmación de compra: muestra el resumen del carrito y dispara el checkout contra la API
const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems, total, loading, error } = useSelector((state) => state.cart);
  const [confirmando, setConfirmando] = useState(false);

  // Confirma la compra; si sale bien vacía el carrito (en el slice) y vuelve al home
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
    <div className="page-container checkout-page">
      <div className="cart-header">
        <h1>Confirmar compra</h1>
        <p className="cart-subtitle">Revisá el resumen antes de confirmar tu pedido.</p>
      </div>

      {error && <div className="cart-error">Error al confirmar la compra: {error}</div>}

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>No hay productos en el carrito.</p>
          <Link to="/" className="btn-continue">Seguir comprando</Link>
        </div>
      ) : (
        <div className="checkout-card">
          <h2>Resumen del pedido</h2>

          <div className="checkout-items">
            {cartItems.map(item => {
              const producto = item.producto || item;
              const cantidad = item.cantidad || item.quantity || 1;
              return (
                <div key={item.id} className="summary-row checkout-item">
                  <span>{producto.nombre}<span className="checkout-item-qty">x{cantidad}</span></span>
                  <span>${((producto.precio || 0) * cantidad).toLocaleString('es-AR')}</span>
                </div>
              );
            })}
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>${(total || 0).toLocaleString('es-AR')}</span>
          </div>

          <div className="checkout-actions">
            <Link to="/cart" className="btn-continue">← Volver al carrito</Link>
            <button
              onClick={handleConfirmar}
              disabled={confirmando || loading}
              className="btn-checkout"
            >
              {confirmando ? 'Confirmando...' : 'Confirmar compra'}
            </button>
          </div>

          <p className="cart-secure">🔒 Compra 100% segura y protegida.</p>
        </div>
      )}
    </div>
  );
};

export default Checkout;
