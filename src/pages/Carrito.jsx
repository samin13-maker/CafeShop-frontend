import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Carrito() {
  const [carrito, setCarrito] = useState({ detalle: [], total: 0 });
  const [form, setForm] = useState({ direccion_envio: '', telefono_contacto: '' });
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const fetchCarrito = async () => {
    const res = await api.get('/carrito');
    setCarrito(res.data);
  };

  useEffect(() => {
    (async () => { await fetchCarrito(); })();
  }, []);

  const cambiarCantidad = async (id_detalle, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    await api.put(`/carrito/${id_detalle}`, { cantidad: nuevaCantidad });
    await fetchCarrito();
  };

  const eliminar = async (id_detalle) => {
    await api.delete(`/carrito/${id_detalle}`);
    await fetchCarrito();
  };

  const validarDireccion = (valor) => {
    return valor.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s*/#]/g, '');
  };

  const validarTelefono = (valor) => {
    return valor.replace(/[^0-9]/g, '');
  };

  const confirmar = async (e) => {
    e.preventDefault();
    try {
      await api.post('/pedidos/confirmar', form);
      setMensaje('¡Pedido confirmado!');
      setTimeout(() => navigate('/mis-pedidos'), 1500);
    } catch (err) {
      setMensaje(err.response?.data?.message || 'Error al confirmar');
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-amber-900 mb-6">Mi Carrito</h1>
      {mensaje && <p className="text-green-600 font-medium mb-4">{mensaje}</p>}
      {carrito.detalle.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío.</p>
      ) : (
        <>
          {carrito.detalle.map(item => (
            <div key={item.id_detalle} className="bg-white rounded-xl shadow p-4 mb-3 flex justify-between items-center">
              <div className="flex-1">
                <p className="font-bold text-amber-900">{item.nombre}</p>
                <p className="text-sm text-gray-500">Subtotal: ${item.subtotal}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => cambiarCantidad(item.id_detalle, item.cantidad - 1)}
                  className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold hover:bg-amber-200">−</button>
                <span className="w-6 text-center font-medium">{item.cantidad}</span>
                <button onClick={() => cambiarCantidad(item.id_detalle, item.cantidad + 1)}
                  className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold hover:bg-amber-200">+</button>
                <button onClick={() => eliminar(item.id_detalle)}
                  className="ml-2 text-red-500 hover:text-red-700">✕</button>
              </div>
            </div>
          ))}
          <p className="text-right font-bold text-amber-900 text-lg mb-6">Total: ${carrito.total}</p>
          <form onSubmit={confirmar} className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="font-bold text-amber-900 text-xl">Confirmar Pedido</h2>
            <div>
              <input type="text" placeholder="Dirección de envío (letras, números, * / #)"
                className="w-full border rounded-lg px-4 py-2"
                value={form.direccion_envio}
                onChange={e => setForm({ ...form, direccion_envio: validarDireccion(e.target.value) })}
                required />
              <p className="text-xs text-gray-400 mt-1">Solo letras, números y los símbolos * / #</p>
            </div>
            <div>
              <input type="text" placeholder="Teléfono de contacto"
                className="w-full border rounded-lg px-4 py-2"
                value={form.telefono_contacto}
                maxLength={15}
                onChange={e => setForm({ ...form, telefono_contacto: validarTelefono(e.target.value) })}
                required />
              <p className="text-xs text-gray-400 mt-1">Solo números</p>
            </div>
            <button type="submit" className="w-full bg-amber-900 text-white py-2 rounded-lg hover:bg-amber-800">
              Confirmar Pedido
            </button>
          </form>
        </>
      )}
    </div>
  );
}