import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-amber-900 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold tracking-wide">☕ CafeShop</Link>
      <div className="flex gap-4 items-center">
        <Link to="/" className="hover:text-amber-200">Catálogo</Link>
        {user ? (
          <>
            <Link to="/carrito" className="hover:text-amber-200">🛒 Carrito</Link>
            <Link to="/mis-pedidos" className="hover:text-amber-200">Mis Pedidos</Link>
            {user.rol === 'admin' && (
              <>
                <Link to="/admin/productos" className="hover:text-amber-200">Admin Productos</Link>
                <Link to="/admin/pedidos" className="hover:text-amber-200">Admin Pedidos</Link>
              </>
            )}
            <span className="text-amber-300 text-sm">Hola, {user.nombre}</span>
            <button onClick={handleLogout} className="bg-amber-700 px-3 py-1 rounded hover:bg-amber-600">
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-amber-200">Iniciar Sesión</Link>
            <Link to="/register" className="bg-amber-700 px-3 py-1 rounded hover:bg-amber-600">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}