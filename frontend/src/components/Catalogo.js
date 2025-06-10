import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Catalogo.css';
import { useCart } from '../context/CartContext';

function Catalogo() {
  const [productos, setProductos] = useState([]);
  const { mensajeProducto, addToCart } = useCart();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://tiendabikes-1.onrender.com';

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/productos/`)
      .then(res => {
        console.log('Respuesta de productos:', res.data);
        if (res.data && Array.isArray(res.data.results)) {
          setProductos(res.data.results);
        } else if (Array.isArray(res.data)) {
          setProductos(res.data);
        } else {
          console.warn('La respuesta no es un array ni tiene results:', res.data);
          setProductos([]);
        }
      })
      .catch(err => {
        console.error('Error al obtener productos:', err);
        setProductos([]);
      });
  }, [API_BASE_URL]);

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/productos/${id}/`);
      alert('Producto eliminado');
      setProductos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      alert('Error al eliminar el producto');
    }
  };

  return (
    <div className="catalogo-container">
      {mensajeProducto && (
        <div className="mensaje-producto">
          {mensajeProducto}
        </div>
      )}

      <h1>Catálogo de Productos</h1>

      <div className="add-button-wrapper">
        <Link to="/agregar">
          <button className="add-button">+ Agregar producto</button>
        </Link>
      </div>

      <div className="productos-grid">
        {productos.length > 0 ? (
          productos.map(p => (
            <div key={p.id} className="producto-card">
              <h3>{p.nombre}</h3>
              {p.imagen && (
                <img
                  className="producto-img"
                  src={
                    p.imagen.startsWith('http')
                      ? p.imagen
                      : `${API_BASE_URL}${p.imagen}`
                  }
                  alt={p.nombre}
                />
              )}
              <p>{p.descripcion}</p>
              <p><strong>Precio:</strong> ${p.precio}</p>
              <p><strong>Stock:</strong> {p.stock}</p>
              <button className="boton-carrito" onClick={() => addToCart(p)}>
                Añadir al carrito
              </button>
              <button
                className="boton-eliminar"
                onClick={() => eliminarProducto(p.id)}
              >
                Eliminar producto
              </button>
            </div>
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>
    </div>
  );
}

export default Catalogo;