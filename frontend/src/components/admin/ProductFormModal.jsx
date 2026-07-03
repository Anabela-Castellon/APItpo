import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ProductImage from './ProductImage';
import { deleteImagenProducto } from '../../store/productsSlice';

const emptyForm = { nombre: '', descripcion: '', precio: '', stock: '', categoriaId: '' };
const MAX_IMAGENES = 5;

const ProductFormModal = ({ producto, categorias, saving, onClose, onSubmit }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState(emptyForm);
  const [nuevasImagenes, setNuevasImagenes] = useState([]);
  const [previews, setPreviews] = useState([]);

  const isEdit = Boolean(producto);

  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio ?? '',
        stock: producto.stock ?? '',
        categoriaId: producto.categorias?.[0]?.id ?? '',
      });
    } else {
      setForm(emptyForm);
    }
    setNuevasImagenes([]);
    setPreviews([]);
  }, [producto]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const imagenesExistentes = producto?.imagenes?.length || 0;

  const handleFiles = (files) => {
    const list = Array.from(files);
    const espacioDisponible = MAX_IMAGENES - imagenesExistentes - nuevasImagenes.length;

    if (espacioDisponible <= 0) {
      window.alert(`Ya alcanzaste el máximo de ${MAX_IMAGENES} fotos por producto.`);
      return;
    }

    const aAgregar = list.slice(0, espacioDisponible);
    if (list.length > aAgregar.length) {
      window.alert(`Solo se agregaron ${aAgregar.length} foto(s): el máximo es ${MAX_IMAGENES} por producto.`);
    }

    setNuevasImagenes((prev) => [...prev, ...aAgregar]);
    setPreviews((prev) => [...prev, ...aAgregar.map((f) => URL.createObjectURL(f))]);
  };

  const removeNuevaImagen = (index) => {
    setNuevasImagenes((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImagen = (imagenId) => {
    dispatch(deleteImagenProducto({ productoId: producto.id, imagenId }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      stock: Number(form.stock),
      categoriaIds: form.categoriaId ? [Number(form.categoriaId)] : [],
      previousCategoriaIds: (producto?.categorias || []).map((c) => c.id),
      imagenes: nuevasImagenes,
    });
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>{isEdit ? 'Editar producto' : 'Nuevo producto'}</h2>
          <button className="admin-modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-row">
            <label>
              Nombre
              <input type="text" value={form.nombre} onChange={handleChange('nombre')} required />
            </label>
            <label>
              Precio
              <input type="number" step="0.01" min="0" value={form.precio} onChange={handleChange('precio')} required />
            </label>
            <label>
              Stock
              <input type="number" min="0" value={form.stock} onChange={handleChange('stock')} required />
            </label>
          </div>

          <label>
            Descripción
            <textarea rows={4} value={form.descripcion} onChange={handleChange('descripcion')} />
          </label>

          <label>
            Categoría
            <select value={form.categoriaId} onChange={handleChange('categoriaId')} required>
              <option value="" disabled>Seleccioná una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </label>

          <div>
            <p className="admin-form-label">
              Fotos del producto ({imagenesExistentes + nuevasImagenes.length}/{MAX_IMAGENES})
            </p>
            {imagenesExistentes + nuevasImagenes.length < MAX_IMAGENES && (
              <label className="admin-dropzone">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <span>📷 Hacé clic para subir fotos</span>
              </label>
            )}

            <div className="admin-image-preview-grid">
              {isEdit && (producto.imagenes || []).map((img) => (
                <div className="admin-image-preview" key={img.id}>
                  <ProductImage productoId={producto.id} imagenId={img.id} alt={producto.nombre} className="admin-preview-img" />
                  <button type="button" onClick={() => handleRemoveExistingImagen(img.id)} title="Eliminar imagen">✕</button>
                </div>
              ))}
              {previews.map((src, i) => (
                <div className="admin-image-preview" key={src}>
                  <img src={src} alt="" className="admin-preview-img" />
                  <button type="button" onClick={() => removeNuevaImagen(i)} title="Quitar">✕</button>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-modal-actions">
            <button type="button" className="admin-btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="admin-btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
