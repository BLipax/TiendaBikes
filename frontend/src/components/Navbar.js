import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <Link to="/">Catálogo</Link> |{" "}
      <Link to="/login">Login</Link> |{" "}
      <Link to="/registro">Registro</Link>
      <Link to="/carrito"> <button>🛒 Ver Carrito</button></Link>
    </nav>
  );
}

export default Navbar;
