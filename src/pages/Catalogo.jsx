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

  const eliminar = async (id_detalle) => {
    await api.delete(`/carrito/${id_detalle}`);
    await fetchCarrito();
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
              <div>
                <p className="font-bold text-amber-900">{item.nombre}</p>
                <p className="text-sm text-gray-500">Cantidad: {item.cantidad} | Subtotal: ${item.subtotal}</p>
              </div>
              <button onClick={() => eliminar(item.id_detalle)} className="text-red-500 hover:text-red-700">✕</button>
            </div>
          ))}
          <p className="text-right font-bold text-amber-900 text-lg mb-6">Total: ${carrito.total}</p>
          <form onSubmit={confirmar} className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="font-bold text-amber-900 text-xl">Confirmar Pedido</h2>
            <input type="text" placeholder="Dirección de envío" className="w-full border rounded-lg px-4 py-2"
              value={form.direccion_envio} onChange={e => setForm({ ...form, direccion_envio: e.target.value })} required />
            <input type="text" placeholder="Teléfono de contacto" className="w-full border rounded-lg px-4 py-2"
              value={form.telefono_contacto} onChange={e => setForm({ ...form, telefono_contacto: e.target.value })} required />
            <button type="submit" className="w-full bg-amber-900 text-white py-2 rounded-lg hover:bg-amber-800">
              Confirmar Pedido
            </button>
          </form>
        </>
      )}
    </div>
  );
}