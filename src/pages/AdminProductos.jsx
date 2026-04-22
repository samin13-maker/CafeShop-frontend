import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '', id_categoria: '' });
  const [imagen, setImagen] = useState(null);
  const [editando, setEditando] = useState(null);
  const [mensaje, setMensaje] = useState('');

const fetchProductos = async () => {
  const res = await api.get('/productos/mis-productos');
  setProductos(res.data);
};

  useEffect(() => {
    (async () => {
      await fetchProductos();
      const res = await api.get('/categorias');
      setCategorias(res.data);
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (imagen) data.append('imagen', imagen);

    try {
      if (editando) {
        await api.put(`/productos/${editando}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMensaje('Producto actualizado');
      } else {
        await api.post('/productos', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMensaje('Producto creado');
      }
      setForm({ nombre: '', descripcion: '', precio: '', stock: '', id_categoria: '' });
      setImagen(null);
      setEditando(null);
      await fetchProductos();
      setTimeout(() => setMensaje(''), 2000);
    } catch (err) {
      setMensaje(err.response?.data?.message || 'Error');
    }
  };

  const handleEditar = (p) => {
    setEditando(p.id_producto);
    setForm({ nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, stock: p.stock, id_categoria: p.id_categoria });
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    await api.delete(`/productos/${id}`);
    await fetchProductos();
  };

  return (
    <div className="min-h-screen bg-amber-50 p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-amber-900 mb-6">Administrar Productos</h1>
      {mensaje && <p className="text-green-600 font-medium mb-4">{mensaje}</p>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-8 grid grid-cols-2 gap-4">
        <input placeholder="Nombre" className="border rounded-lg px-4 py-2" value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })} required />
        <input placeholder="Precio" type="number" className="border rounded-lg px-4 py-2" value={form.precio}
          onChange={e => setForm({ ...form, precio: e.target.value })} required />
        <input placeholder="Stock" type="number" className="border rounded-lg px-4 py-2" value={form.stock}
          onChange={e => setForm({ ...form, stock: e.target.value })} required />
        <select className="border rounded-lg px-4 py-2" value={form.id_categoria}
          onChange={e => setForm({ ...form, id_categoria: e.target.value })} required>
          <option value="">Selecciona categoría</option>
          {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
        </select>
        <textarea placeholder="Descripción" className="border rounded-lg px-4 py-2 col-span-2" value={form.descripcion}
          onChange={e => setForm({ ...form, descripcion: e.target.value })} />
        <input type="file" accept="image/*" className="col-span-2" onChange={e => setImagen(e.target.files[0])} />
        <button type="submit" className="col-span-2 bg-amber-900 text-white py-2 rounded-lg hover:bg-amber-800">
          {editando ? 'Actualizar Producto' : 'Crear Producto'}
        </button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {productos.map(p => (
          <div key={p.id_producto} className="bg-white rounded-xl shadow p-4">
            {p.imagen_url && <img src={p.imagen_url} alt={p.nombre} className="w-full h-32 object-cover rounded-lg mb-2" />}
            <p className="font-bold text-amber-900">{p.nombre}</p>
            <p className="text-sm text-gray-500">${p.precio} | Stock: {p.stock}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => handleEditar(p)} className="flex-1 bg-amber-100 text-amber-900 py-1 rounded-lg hover:bg-amber-200">Editar</button>
              <button onClick={() => handleEliminar(p.id_producto)} className="flex-1 bg-red-100 text-red-700 py-1 rounded-lg hover:bg-red-200">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}