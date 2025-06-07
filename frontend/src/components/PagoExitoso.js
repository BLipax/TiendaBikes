import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function PagoExitoso() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const actualizarStockBackend = async (items) => {
      try {
        const response = await fetch('https://tiendabikes-1.onrender.com/api/productos/actualizar_stock/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        });
        const data = await response.json();
        if (!response.ok) {
          alert('Error al actualizar stock: ' + data.error);
        }
      } catch (error) {
        alert('Error de red al actualizar stock');
      }
    };

    if (cart.length > 0) {
      actualizarStockBackend(cart);
      clearCart();
      alert('Pago exitoso! Stock actualizado.');
      // Redirige luego de 1.5 segundos para que el usuario vea el mensaje
      setTimeout(() => {
        navigate('/catalogo');
      }, 1500);
    } else {
      // Si por alguna razón el carrito está vacío, igual redirige
      navigate('/catalogo');
    }
  }, [cart, clearCart, navigate]);

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h2>Gracias por tu compra!</h2>
      <p>Procesando actualización del stock...</p>
    </div>
  );
}

export default PagoExitoso;
