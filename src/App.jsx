import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import Catalogo from './pages/Catalogo';
import Carrito from './pages/Carrito';
import MisPedidos from './pages/MisPedidos';
import AdminProductos from './pages/AdminProductos';
import AdminPedidos from './pages/AdminPedidos';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.rol === 'admin' ? children : <Navigate to="/" />;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/carrito" element={<PrivateRoute><Carrito /></PrivateRoute>} />
        <Route path="/mis-pedidos" element={<PrivateRoute><MisPedidos /></PrivateRoute>} />
        <Route path="/admin/productos" element={<AdminRoute><AdminProductos /></AdminRoute>} />
        <Route path="/admin/pedidos" element={<AdminRoute><AdminPedidos /></AdminRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;