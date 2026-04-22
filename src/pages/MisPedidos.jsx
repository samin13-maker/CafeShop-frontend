import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    api.get('/pedidos/mis-pedidos').then(res => setPedidos(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-amber-900 mb-6">Mis Pedidos</h1>
      {pedidos.length === 0 ? <p className="text-gray-500">No tienes pedidos aún.</p> : (
        pedidos.map(p => (
          <div key={p.id_pedido} className="bg-white rounded-xl shadow p-4 mb-3">
            <div className="flex justify-between items-center mb-2">
              <p className="font-bold text-amber-900">Pedido #{p.id_pedido}</p>
              <span className={`text-sm px-3 py-1 rounded-full ${p.estado === 'entregado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {p.estado}
              </span>
            </div>
            <p className="text-sm text-gray-500">Producto: {p.producto} x{p.cantidad}</p>
            <p className="text-sm text-gray-500">Dirección: {p.direccion_envio}</p>
            <p className="text-xs text-gray-400">{new Date(p.fecha_pedido).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
}