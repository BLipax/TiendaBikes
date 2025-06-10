import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddCatalog.css';

function AddCatalog() {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen: null
  });
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') data.append(key, value);
    });

    try {
      const response = await fetch('https://tiendabikes-1.onrender.com/api/productos/', {
        method: 'POST',
        body: data
      });

      if (response.ok) {
        setMensaje('Producto agregado exitosamente');
        setFormData({ nombre: '', descripcion: '', precio: '', stock: '', imagen: null });
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
      {['nombre', 'descripcion', 'precio', 'stock'].map((field) => (
        <div className="form-group" key={field}>
          <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
          {field === 'descripcion' ? (
            <textarea name={field} value={formData[field]} onChange={handleChange} required />
          ) : (
            <input
              type={field === 'precio' || field === 'stock' ? 'number' : 'text'}
              step={field === 'precio' ? '0.01' : undefined}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
          )}
        </div>
      ))}

      <div className="form-group">
        <label>Imagen:</label>
        <input type="file" name="imagen" accept="image/*" onChange={handleChange} />
      </div>

      <button type="submit" className="form-button">Crear Producto</button>
      <p className="form-message">{mensaje}</p>
    </form>
  );
}

export default AddCatalog;