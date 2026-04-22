import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/useAuth';

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [agregando, setAgregando] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchProductos = async (q = '') => {
    const res = await api.get(`/productos${q ? `?q=${q}` : ''}`);
    setProductos(res.data);
  };

  useEffect(() => {
    (async () => { await fetchProductos(); })();
  }, []);

  const agregarAlCarrito = async (id_producto) => {
    if (!user) return navigate('/login');
    setAgregando(prev => ({ ...prev, [id_producto]: true }));
    try {
      await api.post('/carrito', { id_producto, cantidad: 1 });
      setTimeout(() => setAgregando(prev => ({ ...prev, [id_producto]: false })), 2000);
    } catch (err) {
      setAgregando(prev => ({ ...prev, [id_producto]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <h1 className="text-3xl font-bold text-amber-900 mb-6 text-center">Nuestros Cafés</h1>
      <div className="flex justify-center mb-6">
        <input type="text" placeholder="Buscar café..." className="border rounded-lg px-4 py-2 w-full max-w-md"
          value={busqueda} onChange={e => { setBusqueda(e.target.value); fetchProductos(e.target.value); }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {productos.map(p => (
          <div key={p.id_producto} className="bg-white rounded-xl shadow p-4 flex flex-col">
            {p.imagen_url
              ? <img src={p.imagen_url} alt={p.nombre} className="w-full h-48 object-cover rounded-lg mb-4" />
              : <div className="w-full h-48 bg-amber-100 rounded-lg mb-4 flex items-center justify-center text-4xl">☕</div>
            }
            <h3 className="font-bold text-amber-900 text-lg">{p.nombre}</h3>
            <p className="text-gray-500 text-sm mb-2">{p.descripcion}</p>
            <p className="text-amber-700 font-bold mb-1">${p.precio}</p>
            <p className="text-gray-400 text-xs mb-4">Stock: {p.stock} | {p.categoria}</p>
            <button onClick={() => agregarAlCarrito(p.id_producto)}
              disabled={agregando[p.id_producto]}
              className={`mt-auto py-2 rounded-lg transition ${agregando[p.id_producto] ? 'bg-green-600 text-white' : 'bg-amber-900 text-white hover:bg-amber-800'}`}>
              {agregando[p.id_producto] ? '✓ Agregado' : 'Agregar al carrito'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}