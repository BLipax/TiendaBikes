import React, { useState } from 'react';
import './AddCatalog.css';
import { useNavigate } from 'react-router-dom';

function AddCatalog() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('stock', stock);
    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      const response = await fetch('http://localhost:8000/api/productos/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMensaje('Producto agregado exitosamente');
        // limpiar campos
        setNombre('');
        setDescripcion('');
        setPrecio('');
        setStock('');
        setImagen(null);
        navigate('/');
      } else {
        setMensaje('Error al crear el producto');
      }
    } catch (error) {
      setMensaje('Error en la conexión');
    }
  };

  return (
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="form-container">
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
    
          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>
    
          <div className="form-group">
            <label>Precio:</label>
            <input
              type="number"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
          </div>
    
          <div className="form-group">
            <label>Stock:</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>
    
          <div className="form-group">
            <label>Imagen:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagen(e.target.files[0])}
            />
          </div>
    
          <button type="submit" className="form-button">Crear Producto</button>
    
          <p className="form-message">{mensaje}</p>
        </form>
      );
    }
    
    export default AddCatalog;