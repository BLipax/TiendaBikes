import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Catalogo.css';
import { useCart } from '../context/CartContext';

function Catalogo() {
  const [productos, setProductos] = useState([]);
  const { mensajeProducto , addToCart } = useCart();

  useEffect(() => {
    axios.get('http://localhost:8000/api/productos/')
      .then(res => setProductos(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', textAlign: 'center' }}>
      {mensajeProducto && (
        <div
          style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px',
            fontWeight: 'bold',
          }}
        >
          {mensajeProducto}
        </div>
      )}

      <div style={{ padding: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Catálogo de Productos</h1>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <Link to="/agregar">
            <button style={{
              padding: '10px 15px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              + Agregar producto
            </button>
          </Link>
        </div>

        <div className="productos-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '20px'}}>
          {productos.map(p => (
            <div key={p.id} className="producto-card" style={{border: '1px solid #ddd', padding: '15px', borderRadius: '5px', textAlign: 'left'}}>
              <h3>{p.nombre}</h3>
              {p.imagen && (
                <img
                  src={p.imagen.startsWith('http') ? p.imagen : `http://localhost:8000${p.imagen}`}
                  alt={p.nombre}
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
                />
              )}
              <p>{p.descripcion}</p>
              <p><strong>Precio: </strong>${p.precio}</p>
              <p><strong>Stock:</strong> {p.stock}</p>
              <button 
                onClick={() => addToCart(p)} 
                style={{
                  marginTop: '10px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Añadir al carrito
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Catalogo;
