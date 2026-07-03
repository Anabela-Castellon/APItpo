import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../hooks/useContext/CartContext';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorito } from '../store/favoritosSlice';
import { apiFetch, getImagenUrl } from '../services/api';
import faheart from '../assets/heart-solid-full.svg';
import faheartn from '../assets/heart-regular-full.svg';
import enviosIcon from '../assets/envios.png';
import productosIcon from '../assets/productoss.png';
import pedidosIcon from '../assets/pedidoss.png';
import retiroIcon from '../assets/retiro.png';
import '../styles/catalog.css';
import '../styles/productDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [imagenActiva, setImagenActiva] = useState(0);
  const [cantidad, setCantidad] = useState(1);

  const { addToCart, cartItems } = useCart();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const esFavorito = useSelector((state) => state.favoritos.items.some((item) => item.id === Number(id)));

  useEffect(() => {
    const fetchProductoDetalle = async () => {
      setCargando(true);
      setImagenActiva(0);
      setCantidad(1);
      try {
        const data = await apiFetch(`/productos/${id}`);
        setProducto(data);
      } catch (err) {
        console.error('Error fetching producto detalle:', err);
        setError('No se pudo cargar el detalle del producto.');
      } finally {
        setCargando(false);
      }
    };

    if (id) fetchProductoDetalle();
  }, [id]);

  if (cargando) return <p style={{ textAlign: 'center', padding: '4rem' }}>Cargando detalle del producto...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center', padding: '4rem' }}>{error}</p>;
  if (!producto) return <p style={{ textAlign: 'center', padding: '4rem' }}>Producto no encontrado.</p>;

  const imagenes = producto.imagenes || [];
  const stock = producto.stock ?? Infinity;
  const enCarrito = cartItems.find((item) => item.id === producto.id)?.quantity || 0;
  const disponibleParaAgregar = Math.max(stock - enCarrito, 0);
  const sinStock = stock <= 0;
  const categoriaNombre = producto.categorias?.[0]?.nombre;

  const handleToggleFavorite = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    dispatch(toggleFavorito(producto));
  };

  const handleAgregarAlCarrito = () => {
    addToCart(producto, cantidad);
  };

  const handleComprarAhora = () => {
    addToCart(producto, cantidad);
    navigate('/checkout');
  };

  return (
    <div className="pd-page">
      <div className="pd-breadcrumb">
        <Link to="/">Inicio</Link>
        <span>›</span>
        {categoriaNombre && (
          <>
            <span>{categoriaNombre}</span>
            <span>›</span>
          </>
        )}
        <span className="pd-breadcrumb-current">{producto.nombre}</span>
      </div>

      <div className="pd-layout">
        <div className="pd-gallery">
          <div className="pd-thumbs">
            {imagenes.length > 0 ? (
              imagenes.map((img, index) => (
                <button
                  key={img.id}
                  className={`pd-thumb${index === imagenActiva ? ' active' : ''}`}
                  onClick={() => setImagenActiva(index)}
                >
                  <img src={getImagenUrl(producto.id, img.id)} alt={`${producto.nombre} ${index + 1}`} />
                </button>
              ))
            ) : (
              <div className="pd-thumb active">
                <div className="pd-img-placeholder" aria-hidden="true">🎂</div>
              </div>
            )}
          </div>

          <div className="pd-main-image">
            {imagenes.length > 0 ? (
              <img src={getImagenUrl(producto.id, imagenes[imagenActiva].id)} alt={producto.nombre} />
            ) : (
              <div className="pd-img-placeholder pd-img-placeholder-main" aria-hidden="true">🎂</div>
            )}
          </div>
        </div>

        <div className="pd-info">
          <button className="pd-hecho-con-amor" onClick={handleToggleFavorite}>
            <img src={esFavorito ? faheart : faheartn} alt="" className="pd-heart-icon" />
            HECHO CON AMOR, TODOS LOS DÍAS
          </button>

          <h1 className="pd-title">{producto.nombre}</h1>
          <p className="pd-price">${producto.precio.toLocaleString('es-AR')}</p>

          <div className="pd-availability">
            <span className="dot"></span> {sinStock ? 'Sin stock' : 'Disponible hoy'}
          </div>

          <p className="pd-description">{producto.descripcion}</p>

          <div className="pd-purchase-row">
            <div>
              <p className="pd-label">Cantidad</p>
              <div className="pd-qty-selector">
                <button type="button" onClick={() => setCantidad((c) => Math.max(1, c - 1))} disabled={cantidad <= 1}>−</button>
                <span>{cantidad}</span>
                <button
                  type="button"
                  onClick={() => setCantidad((c) => Math.min(disponibleParaAgregar || 1, c + 1))}
                  disabled={cantidad >= disponibleParaAgregar}
                >
                  +
                </button>
              </div>
            </div>

            <button type="button" className="pd-dedicatoria" title="Próximamente disponible">
              <span aria-hidden="true">🌿</span>
              <span>
                <strong>Agregar dedicatoria</strong>
                <small>Sorprendé con un mensaje especial</small>
              </span>
              <span aria-hidden="true">›</span>
            </button>
          </div>

          <button
            type="button"
            className="pd-btn-primary"
            onClick={handleAgregarAlCarrito}
            disabled={sinStock || disponibleParaAgregar <= 0}
          >
            🛒 {sinStock || disponibleParaAgregar <= 0 ? 'Sin stock disponible' : 'Agregar al carrito'}
          </button>

          <button
            type="button"
            className="pd-btn-secondary"
            onClick={handleComprarAhora}
            disabled={sinStock || disponibleParaAgregar <= 0}
          >
            📦 Comprar ahora
          </button>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-item">
          <img src={enviosIcon} alt="Envíos en el día" className="feature-icon" />
          <div className="feature-text">
            <h4>Envíos en el día</h4>
            <p>Recibí tu pedido rápido y fresco.</p>
          </div>
        </div>
        <div className="feature-divider"></div>

        <div className="feature-item">
          <img src={productosIcon} alt="Productos frescos" className="feature-icon" />
          <div className="feature-text">
            <h4>Productos frescos</h4>
            <p>Elaboramos todos los días.</p>
          </div>
        </div>
        <div className="feature-divider"></div>

        <div className="feature-item">
          <img src={pedidosIcon} alt="Pedidos personalizados" className="feature-icon" />
          <div className="feature-text">
            <h4>Pedidos personalizados</h4>
            <p>Tortas y box a tu medida.</p>
          </div>
        </div>
        <div className="feature-divider"></div>

        <div className="feature-item">
          <img src={retiroIcon} alt="Retiro en tienda" className="feature-icon" />
          <div className="feature-text">
            <h4>Retiro en tienda</h4>
            <p>Pasá a buscar tu pedido.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
