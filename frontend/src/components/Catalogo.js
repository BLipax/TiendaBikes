import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Catalogo.css';
import { useCart } from '../context/CartContext';

function Catalogo() {
  const [productos, setProductos] = useState([]);
  const { mensajeProducto, addToCart } = useCart();

  useEffect(() => {
    axios.get('https://tiendabikes-1.onrender.com/api/productos/')
      .then(res => setProductos(res.data))
      .catch(console.error);
  }, []);

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Estás seguro que quieres eliminar este producto?")) return;

    try {
      await axios.delete(`https://tiendabikes-1.onrender.com/api/productos/${id}/`);
      setProductos((prev) => prev.filter(p => p.id !== id));
    } catch (err) {
      alert("Error al eliminar el producto.");
      console.error(err);
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
        {productos.map(p => (
          <div key={p.id} className="producto-card">
            <h3>{p.nombre}</h3>
            {p.imagen && (
              <img
                src={p.imagen.startsWith('http') ? p.imagen : `https://tiendabikes-1.onrender.com${p.imagen}`}
                alt={p.nombre}
              />
            )}
            <p>{p.descripcion}</p>
            <p><strong>Precio:</strong> ${p.precio}</p>
            <p><strong>Stock:</strong> {p.stock}</p>
            <button onClick={() => addToCart(p)} className="cart-button">Añadir al carrito</button>
            <button onClick={() => eliminarProducto(p.id)} className="delete-button">Eliminar producto</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalogo;
