import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);

  const fetchPedidos = async () => {
    const res = await api.get('/pedidos');
    setPedidos(res.data);
  };

  useEffect(() => {
    (async () => { await fetchPedidos(); })();
  }, []);

  const cambiarEstado = async (id_pedido, estado) => {
    await api.put(`/pedidos/${id_pedido}/estado`, { estado });
    fetchPedidos();
  };

  return (
    <div className="min-h-screen bg-amber-50 p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-amber-900 mb-6">Administrar Pedidos</h1>
      {pedidos.map(p => (
        <div key={`${p.id_pedido}-${p.producto}`} className="bg-white rounded-xl shadow p-4 mb-3">
          <div className="flex justify-between items-center mb-2">
            <p className="font-bold text-amber-900">Pedido #{p.id_pedido} — {p.cliente}</p>
            <span className={`text-sm px-3 py-1 rounded-full ${p.estado === 'entregado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {p.estado}
            </span>
          </div>
          <p className="text-sm text-gray-500">Producto: {p.producto} x{p.cantidad} — ${p.precio_unitario}</p>
          <p className="text-sm text-gray-500">Dirección: {p.direccion_envio} | Tel: {p.telefono_contacto}</p>
          {p.estado === 'pendiente' && (
            <button onClick={() => cambiarEstado(p.id_pedido, 'entregado')}
              className="mt-3 bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700 text-sm">
              Marcar como entregado
            </button>
          )}
        </div>
      ))}
    </div>
  );
}