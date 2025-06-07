import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Catalogo from './components/Catalogo';
import Login from './components/Login';
import Registro from './components/Registro';
import Navbar from './components/Navbar';
import AgregarProducto from './components/AgregarProductos';
import Carrito from './components/Carrito';
import PagoExitoso from './components/PagoExitoso';


function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/agregar" element={<AgregarProducto />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pago-exitoso" element={<PagoExitoso />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </div>
  );
}

export default App;