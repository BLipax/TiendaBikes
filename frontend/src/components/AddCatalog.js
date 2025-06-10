import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddCatalog.css';

function AddCatalog() {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen: null,
  });
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Base URL for the backend
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://tiendabikes-1.onrender.com';

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (formData.precio && Number(formData.precio) <= 0) {
      setMensaje('El precio debe ser mayor que 0');
      return;
    }
    if (formData.stock && Number(formData.stock) < 0) {
      setMensaje('El stock no puede ser negativo');
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') data.append(key, value);
    });

    setLoading(true);
    setMensaje('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/productos/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMensaje('Producto agregado exitosamente');
      setFormData({ nombre: '', descripcion: '', precio: '', stock: '', imagen: null });
      // Delay redirect to show success message
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      const errorMessage =
        error.response?.status === 400
          ? 'Datos inválidos. Verifica los campos e intenta de nuevo.'
          : error.response?.status === 403
          ? 'No tienes permiso para crear productos.'
          : error.response?.status === 500
          ? 'Error en el servidor. Intenta de nuevo más tarde.'
          : 'Error al conectar con el servidor.';
      setMensaje(errorMessage);
      console.error('Error al crear producto:', error);
    } finally {
      setLoading(false);
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
              required={field !== 'stock'} // Stock can be 0
              min={field === 'precio' ? '0.01' : field === 'stock' ? '0' : undefined}
            />
          )}
        </div>
      ))}

      <div className="form-group">
        <label>Imagen:</label>
        <input type="file" name="imagen" accept="image/*" onChange={handleChange} />
      </div>

      <button type="submit" className="form-button" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Producto'}
      </button>
      {mensaje && <p className="form-message">{mensaje}</p>}
    </form>
  );
}

export default AddCatalog;