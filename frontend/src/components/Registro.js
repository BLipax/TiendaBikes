import { useState } from 'react';
import axios from 'axios';

function Registro() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('https://tiendabikes-1.onrender.com/api/usuarios/registro/', form);
      alert('Usuario registrado');
      // Opcional: limpiar formulario
      setForm({ username: '', email: '', password: '' });
    } catch (err) {
      alert('Error al registrar');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <form onSubmit={handleSubmit}>
          <h2>Registro</h2>
          <input
            name="username"
            onChange={handleChange}
            placeholder="Usuario"
            value={form.username}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <input
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="Correo"
            value={form.email}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <input
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="Contraseña"
            value={form.password}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <button type="submit" style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registro;
