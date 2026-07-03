// Ruta: src/hooks/useContext/CartContext.jsx
//
// Este archivo es el "cerebro" del carrito.
// Acá guardamos los productos que el usuario fue agregando,
// y exportamos las funciones para modificarlos desde cualquier componente.
// Usamos Context para no tener que pasar props de componente en componente.
 
import React, { useState, useContext, createContext } from 'react';
 
// Creamos el "canal" por donde va a viajar la info del carrito.
// Por ahora está vacío, lo llenamos en el CartProvider más abajo.
const CartContext = createContext();
 
// -- HOOK PERSONALIZADO --
// En lugar de importar useContext + CartContext en cada componente,
// simplemente importamos useCart() y ya tenemos todo.
export function useCart() {
  const context = useContext(CartContext);
 
  // Si alguien usa useCart() fuera del CartProvider, le avisamos con un error claro.
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
 
  return context;
}
 
// -- PROVIDER --
// Este componente "envuelve" toda la app (lo hacemos en App.jsx).
// Cualquier componente dentro del Provider puede leer y modificar el carrito.
export function CartProvider({ children }) {
 
  // cartItems es el array con los productos del carrito.
  // Cada item tiene los datos del producto + una propiedad "quantity" (cantidad).
  const [cartItems, setCartItems] = useState([]);
 
  // Agrega un producto al carrito, respetando el stock disponible.
  // Si el producto ya estaba, aumenta la cantidad en vez de duplicarlo.
  const addToCart = (product, cantidad = 1) => {
    const stockMax = product.stock ?? Infinity;

    setCartItems(prevItems => {
      const existe = prevItems.find(item => item.id === product.id);

      if (existe) {
        const nuevaCantidad = Math.min(existe.quantity + cantidad, stockMax);
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: nuevaCantidad }
            : item
        );
      }

      return [...prevItems, { ...product, quantity: Math.min(cantidad, stockMax) }];
    });
  };
 
  // Elimina un producto del carrito completamente (sin importar la cantidad).
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
 
  // Cambia la cantidad de un producto.
  // Si la cantidad llega a 0 o menos, lo eliminamos directamente.
  const updateQuantity = (productId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.min(nuevaCantidad, item.stock ?? Infinity) }
          : item
      )
    );
  };
 
  // Vacía el carrito completo (lo usamos al confirmar la compra).
  const clearCart = () => setCartItems([]);
 
  // El total se calcula sumando precio * cantidad de cada producto.
  // Se recalcula automáticamente cada vez que cambia cartItems.
  const total = cartItems.reduce((acc, item) => acc + item.precio * item.quantity, 0);
 
  // Todo lo que ponemos acá es lo que van a poder usar los componentes.
  const value = { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, total };
 
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}