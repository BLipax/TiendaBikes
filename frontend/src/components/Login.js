import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/usuarios/login/', form);
      localStorage.setItem('access', res.data.access);
      alert('Login exitoso');
    } catch (err) {
      alert('Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input name="username" onChange={handleChange} placeholder="Usuario" />
      <input name="password" type="password" onChange={handleChange} placeholder="Contraseña" />
      <button type="submit">Ingresar</button>
    </form>
  );
}

export default Login;