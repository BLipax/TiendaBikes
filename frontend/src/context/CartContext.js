import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [mensajeProducto, setMensajeProducto] = useState('');

  // Agrega producto al carrito y lanza notificación
  function addToCart(producto) {
    setCart(prev => {
      // Lógica para agregar producto, por ejemplo sumar si ya está
      const existing = prev.find(item => item.id === producto.id);
      if (existing) {
        return prev.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });

    // Mostrar mensaje por 3 segundos
    setMensajeProducto('Producto agregado correctamente');
    setTimeout(() => setMensajeProducto(''), 3000);
  }

  // Funciones para quitar, actualizar cantidad, limpiar carrito, etc.
  function removeFromCart(id) {
    setCart(prev => prev.filter(item => item.id !== id));
  }

  function updateQuantity(id, cantidad) {
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, cantidad: Number(cantidad) } : item))
    );
  }

  function clearCart() {
    setCart([]);
  }

  const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        mensajeProducto,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
