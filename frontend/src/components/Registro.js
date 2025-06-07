import { useState } from 'react';
import axios from 'axios';

function Registro() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/usuarios/registro/', form);
      alert('Usuario registrado');
    } catch (err) {
      alert('Error al registrar');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>
      <input name="username" onChange={handleChange} placeholder="Usuario" />
      <input name="email" onChange={handleChange} placeholder="Correo" />
      <input name="password" type="password" onChange={handleChange} placeholder="Contraseña" />
      <button type="submit">Registrarse</button>
    </form>
  );
}

export default Registro;  