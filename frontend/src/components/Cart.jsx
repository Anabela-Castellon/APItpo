// Ruta: src/components/Cart.jsx

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchCartItems,
  addProductoToCart,
  removeProductoFromCart
} from '../store/cartSlice';
import { getImagenUrl } from '../services/api';
import '../styles/cart.css';

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18" strokeLinecap="round" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" />
    <path d="M10 11v6M14 11v6" strokeLinecap="round" />
  </svg>
);

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
    return <div className="cart-loading">Cargando carrito...</div>;
  }

  return (
    <div className="page-container cart-page">
      <div className="cart-header">
        <h1>Mi carrito</h1>
        <p className="cart-subtitle">Revisá tu pedido antes de finalizar la compra.</p>
      </div>

      {error && <div className="cart-error">Error al actualizar el carrito: {error}</div>}

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Tu carrito está vacío</p>
          <Link to="/" className="btn-continue">Seguir comprando</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-table">
            <div className="cart-row cart-row-head">
              <span>Producto</span>
              <span>Precio unitario</span>
              <span>Cantidad</span>
              <span>Subtotal</span>
              <span></span>
            </div>

            {cartItems.map(item => {
              const productoInfo = item.producto || item;
              const itemQuantity = item.quantity || item.cantidad || 1;
              const productoId = productoInfo.id;
              const precio = productoInfo.precio || 0;
              const subtotal = precio * itemQuantity;

              const stockDisponible = productoInfo.stock;
              const alcanzoLimite = stockDisponible !== undefined && itemQuantity >= stockDisponible;
              const sinStock = stockDisponible !== undefined && stockDisponible <= 0;
              const primeraImagen = productoInfo.imagenes?.[0];

              return (
                <div key={item.id} className={`cart-row${loading ? ' cart-row-loading' : ''}`}>
                  <div className="cart-product">
                    <div className="cart-product-img">
                      {primeraImagen ? (
                        <img src={getImagenUrl(productoId, primeraImagen.id)} alt={productoInfo.nombre} />
                      ) : (
                        <div className="cart-img-placeholder" aria-hidden="true">🎂</div>
                      )}
                    </div>
                    <div className="cart-product-info">
                      <h3>{productoInfo.nombre || 'Producto sin nombre'}</h3>
                      <div className="availability">
                        <span className={`dot${sinStock ? ' dot-off' : ''}`}></span>
                        {sinStock ? 'Sin stock' : 'Disponible hoy'}
                      </div>
                    </div>
                  </div>

                  <div className="cart-cell cart-price">${precio.toLocaleString('es-AR')}</div>

                  <div className="cart-cell">
                    <div className="qty-box">
                      <button
                        disabled={loading}
                        onClick={() => handleUpdateQuantity(productoId, itemQuantity, itemQuantity - 1, stockDisponible)}
                        aria-label="Restar"
                      >
                        −
                      </button>
                      <span>{itemQuantity}</span>
                      <button
                        disabled={loading || alcanzoLimite}
                        onClick={() => handleUpdateQuantity(productoId, itemQuantity, itemQuantity + 1, stockDisponible)}
                        title={alcanzoLimite ? 'Alcanzaste el stock máximo disponible' : 'Agregar uno más'}
                        aria-label="Sumar"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-cell cart-subtotal">${subtotal.toLocaleString('es-AR')}</div>

                  <div className="cart-cell cart-remove">
                    <button
                      disabled={loading}
                      onClick={() => dispatch(removeProductoFromCart(productoId))}
                      aria-label="Eliminar del carrito"
                      className="btn-trash"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="cart-banner">
              <span>🥄 Todo lo que ves es elaborado artesanalmente con ingredientes reales y mucho amor.</span>
            </div>
          </div>

          <aside className="cart-summary">
            <h2>Resumen de tu pedido</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${(total || 0).toLocaleString('es-AR')}</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>${(total || 0).toLocaleString('es-AR')}</span>
            </div>

            <Link to="/checkout" className="btn-checkout">Finalizar compra</Link>
            <Link to="/" className="btn-continue">← Seguir comprando</Link>

            <p className="cart-secure">🔒 Compra 100% segura y protegida.</p>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
