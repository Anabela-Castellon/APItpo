import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductImage from '../../components/admin/ProductImage';
import ProductFormModal from '../../components/admin/ProductFormModal';
import {
  fetchProductos,
  fetchCategorias,
  createProducto,
  updateProducto,
  deleteProducto,
} from '../../store/productsSlice';

const AdminProductos = () => {
  const dispatch = useDispatch();
  const { items, categorias, loading, saving } = useSelector((state) => state.productos);
  const [search, setSearch] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  useEffect(() => {
    dispatch(fetchProductos());
    dispatch(fetchCategorias());
  }, [dispatch]);

  const productosFiltrados = useMemo(() => {
    return items.filter((p) => {
      const matchNombre = p.nombre?.toLowerCase().includes(search.toLowerCase());
      const matchCategoria = !categoriaFiltro || (p.categorias || []).some((c) => String(c.id) === categoriaFiltro);
      return matchNombre && matchCategoria;
    });
  }, [items, search, categoriaFiltro]);

  const abrirNuevo = () => {
    setProductoEditando(null);
    setModalOpen(true);
  };

  const abrirEditar = (producto) => {
    setProductoEditando(producto);
    setModalOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      const accion = productoEditando
        ? updateProducto({ id: productoEditando.id, ...data })
        : createProducto(data);
      const { erroresImagenes } = await dispatch(accion).unwrap();

      setModalOpen(false);

      if (erroresImagenes.length > 0) {
        window.alert(`El producto se guardó, pero algunas imágenes no se pudieron subir:\n${erroresImagenes.join('\n')}`);
      }
    } catch (error) {
      window.alert(`No se pudo guardar el producto: ${error}`);
    }
  };

  const handleDelete = (producto) => {
    if (window.confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`)) {
      dispatch(deleteProducto(producto.id));
    }
  };

  return (
    <AdminLayout title="Productos">
      <div className="admin-page-header">
        <div>
          <h2>Productos</h2>
          <p className="admin-page-subtitle">{items.length} productos en catálogo</p>
        </div>
        <button className="admin-btn-primary" onClick={abrirNuevo}>+ Nuevo producto</button>
      </div>

      <div className="admin-card admin-filters-bar">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-input"
        />
        <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)} className="admin-input">
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
      </div>

      <div className="admin-card">
        {loading ? (
          <p className="admin-empty">Cargando productos...</p>
        ) : productosFiltrados.length === 0 ? (
          <p className="admin-empty">No se encontraron productos.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categorías</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((producto) => (
                <tr key={producto.id}>
                  <td>
                    <div className="admin-table-product">
                      <ProductImage
                        productoId={producto.id}
                        imagenId={producto.imagenes?.[0]?.id}
                        alt={producto.nombre}
                        className="admin-table-thumb"
                      />
                      <span>{producto.nombre}</span>
                    </div>
                  </td>
                  <td>
                    <div className="admin-chip-group">
                      {(producto.categorias || []).map((c) => (
                        <span className="admin-badge" key={c.id}>{c.nombre}</span>
                      ))}
                    </div>
                  </td>
                  <td>${Number(producto.precio).toLocaleString('es-AR')}</td>
                  <td>{producto.stock}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button className="admin-btn-icon" onClick={() => abrirEditar(producto)} title="Editar">✏️</button>
                      <button className="admin-btn-icon" onClick={() => handleDelete(producto)} title="Eliminar">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <ProductFormModal
          producto={productoEditando}
          categorias={categorias}
          saving={saving}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </AdminLayout>
  );
};

export default AdminProductos;
