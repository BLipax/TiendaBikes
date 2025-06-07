import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

function Carrito() {
  const { cart, total, removeFromCart, updateQuantity, clearCart, mensajeProducto } = useCart();

  const [mensajePago, setMensajePago] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mensajePago) {
      const timer = setTimeout(() => setMensajePago(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensajePago]);

  const handlePagar = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://tiendabikes-1.onrender.com/api/productos/iniciar_pago/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total: total.toFixed(2) }),
      });
      const data = await response.json();
      if (data.url && data.token) {
        setMensajePago('Redirigiendo a Transbank...');
        window.location.href = `${data.url}?token_ws=${data.token}`;
      } else {
        setMensajePago('Error: no se recibió URL ni token.');
      }
    } catch (error) {
      setMensajePago('Error al iniciar el pago.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
      }}
    >
      <h1 style={{ textAlign: 'center' }}>Carrito de Compras</h1>

      {mensajeProducto && (
        <div style={{ color: 'green', marginBottom: '10px' }}>
          {mensajeProducto}
        </div>
      )}

      {mensajePago && (
        <div style={{ color: mensajePago.includes('Error') ? 'red' : 'blue', marginBottom: '10px' }}>
          {mensajePago}
        </div>
      )}

      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          {cart.map(item => (
            <div
              key={item.id}
              style={{
                borderBottom: '1px solid #ccc',
                marginBottom: '10px',
                paddingBottom: '10px',
                width: '100%',
              }}
            >
              <h3>{item.nombre}</h3>
              <p>{item.descripcion}</p>
              <input
                type="number"
                value={item.cantidad}
                onChange={(e) => updateQuantity(item.id, e.target.value)}
                min="1"
              />
              <p>Precio unitario: ${item.precio}</p>
              <p>Subtotal: ${item.precio * item.cantidad}</p>
              <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
            </div>
          ))}
          <h2>Total: ${total.toFixed(2)}</h2>
          <button
            onClick={handlePagar}
            disabled={loading}
            style={{
              backgroundColor: '#0070f3',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Procesando pago...' : 'Pagar con Transbank'}
          </button>
          <button
            onClick={clearCart}
            style={{
              marginTop: '10px',
              backgroundColor: 'red',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Vaciar Carrito
          </button>
        </>
      )}
    </div>
  );
}

export default Carrito;
