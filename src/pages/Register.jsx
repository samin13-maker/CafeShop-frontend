import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({ nombre: '', correo: '', contraseña: '', telefono: '', direccion: '', rol: 'cliente' });
  const [errores, setErrores] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validarTelefono = (valor) => valor.replace(/[^0-9]/g, '');
  const validarDireccion = (valor) => valor.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s*/#]/g, '');

  const validarFormulario = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';

    if (!form.correo.includes('@')) e.correo = 'Correo inválido';

    const passRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passRegex.test(form.contraseña)) {
      e.contraseña = 'Mínimo 8 caracteres, una letra, un número y un carácter especial';
    }

    if (form.telefono && form.telefono.length < 10) e.telefono = 'Teléfono debe tener al menos 10 dígitos';

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erroresValidacion = validarFormulario();
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      return;
    }
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">Crear Cuenta</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <input type="text" placeholder="Nombre completo" className="w-full border rounded-lg px-4 py-2"
              value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
            {errores.nombre && <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>}
          </div>

          <div>
            <input type="email" placeholder="Correo" className="w-full border rounded-lg px-4 py-2"
              value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })} required />
            {errores.correo && <p className="text-red-500 text-xs mt-1">{errores.correo}</p>}
          </div>

          <div>
            <input type="password" placeholder="Contraseña" className="w-full border rounded-lg px-4 py-2"
              value={form.contraseña} onChange={e => setForm({ ...form, contraseña: e.target.value })} required />
            {errores.contraseña
              ? <p className="text-red-500 text-xs mt-1">{errores.contraseña}</p>
              : <p className="text-gray-400 text-xs mt-1">Mínimo 8 caracteres, una letra, un número y un carácter especial</p>
            }
          </div>

          <div>
            <input type="text" placeholder="Teléfono (solo números)" className="w-full border rounded-lg px-4 py-2"
              value={form.telefono} maxLength={15}
              onChange={e => setForm({ ...form, telefono: validarTelefono(e.target.value) })} />
            {errores.telefono && <p className="text-red-500 text-xs mt-1">{errores.telefono}</p>}
          </div>

          <div>
            <input type="text" placeholder="Dirección" className="w-full border rounded-lg px-4 py-2"
              value={form.direccion}
              onChange={e => setForm({ ...form, direccion: validarDireccion(e.target.value) })} />
            <p className="text-gray-400 text-xs mt-1">Solo letras, números y los símbolos * / #</p>
          </div>

          <div className="flex gap-4">
            <label className={`flex-1 border-2 rounded-lg p-3 cursor-pointer text-center transition ${form.rol === 'cliente' ? 'border-amber-900 bg-amber-50' : 'border-gray-200'}`}>
              <input type="radio" name="rol" value="cliente" className="hidden"
                onChange={() => setForm({ ...form, rol: 'cliente' })} defaultChecked />
              <span className="text-2xl block mb-1">🛒</span>
              <span className="font-medium text-amber-900">Cliente</span>
              <p className="text-xs text-gray-500 mt-1">Quiero comprar café</p>
            </label>
            <label className={`flex-1 border-2 rounded-lg p-3 cursor-pointer text-center transition ${form.rol === 'admin' ? 'border-amber-900 bg-amber-50' : 'border-gray-200'}`}>
              <input type="radio" name="rol" value="admin" className="hidden"
                onChange={() => setForm({ ...form, rol: 'admin' })} />
              <span className="text-2xl block mb-1">☕</span>
              <span className="font-medium text-amber-900">Vendedor</span>
              <p className="text-xs text-gray-500 mt-1">Tengo una tienda de café</p>
            </label>
          </div>

          <button type="submit" className="w-full bg-amber-900 text-white py-2 rounded-lg hover:bg-amber-800">
            Registrarse
          </button>
        </form>
        <p className="text-center text-sm mt-4">¿Ya tienes cuenta? <Link to="/login" className="text-amber-700">Inicia sesión</Link></p>
      </div>
    </div>
  );
}