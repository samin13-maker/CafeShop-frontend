import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/useAuth';

export default function Login() {
  const [form, setForm] = useState({ correo: '', contraseña: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.usuario, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">Iniciar Sesión</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Correo" className="w-full border rounded-lg px-4 py-2"
            value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })} required />
          <input type="password" placeholder="Contraseña" className="w-full border rounded-lg px-4 py-2"
            value={form.contraseña} onChange={e => setForm({ ...form, contraseña: e.target.value })} required />
          <button type="submit" className="w-full bg-amber-900 text-white py-2 rounded-lg hover:bg-amber-800">
            Entrar
          </button>
        </form>
        <p className="text-center text-sm mt-4">¿No tienes cuenta? <Link to="/register" className="text-amber-700">Regístrate</Link></p>
      </div>
    </div>
  );
}