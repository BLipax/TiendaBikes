import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Catalogo.css';
import { useCart } from '../context/CartContext';

function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { mensajeProducto, addToCart } = useCart();

  // URL base desde variable de entorno o fallback local
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://tiendabikes-1.onrender.com';

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`${API_BASE_URL}/api/productos/`);
        console.log('Respuesta de productos:', res.data);

        // Soporte para DRF con paginación o sin ella
        if (Array.isArray(res.data.results)) {
          setProductos(res.data.results);
        } else if (Array.isArray(res.data)) {
          setProductos(res.data);
        } else {
          console.warn('La respuesta no es un array:', res.data);
          setProductos([]);
          setError('Formato de datos inesperado.');
        }
      } catch (err) {
        console.error('Error al obtener productos:', err);
        setProductos([]);
        setError('No se pudieron cargar los productos. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [API_BASE_URL]);

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/productos/${id}/`);
      alert('Producto eliminado correctamente.');
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      const errorMessage =
        err.response?.status === 404
          ? 'Producto no encontrado.'
          : err.response?.status === 403
          ? 'No tienes permiso para eliminar este producto.'
          : 'Error al eliminar el producto.';
      alert(errorMessage);
      console.error('Error al eliminar producto:', err);
    }
  };

  return (
    <div className="catalogo-container">
      {mensajeProducto && (
        <div className="mensaje-producto">{mensajeProducto}</div>
      )}

      <h1>Catálogo de Productos</h1>

      {error && <p className="error-message">{error}</p>}

      <div className="add-button-wrapper">
        <Link to="/agregar">
          <button className="add-button">+ Agregar producto</button>
        </Link>
      </div>

      <div className="productos-grid">
        {Array.isArray(productos) && productos.length > 0 ? (
          productos.map((p) => (
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
          !loading && <p>No hay productos disponibles.</p>
        )}
      </div>
    </div>
  );
}

export default Catalogo;
