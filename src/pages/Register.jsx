import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({ nombre: '', correo: '', contraseña: '', telefono: '', direccion: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">Crear Cuenta</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {['nombre', 'correo', 'contraseña', 'telefono', 'direccion'].map(field => (
            <input key={field} type={field === 'contraseña' ? 'password' : field === 'correo' ? 'email' : 'text'}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full border rounded-lg px-4 py-2"
              value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
              required={['nombre', 'correo', 'contraseña'].includes(field)} />
          ))}
          <button type="submit" className="w-full bg-amber-900 text-white py-2 rounded-lg hover:bg-amber-800">
            Registrarse
          </button>
        </form>
        <p className="text-center text-sm mt-4">¿Ya tienes cuenta? <Link to="/login" className="text-amber-700">Inicia sesión</Link></p>
      </div>
    </div>
  );
}