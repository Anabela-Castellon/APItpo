import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { apiFetch } from '../services/api';
import { normalizar, iconosPorCategoria, iconTodos, ordenarCategorias } from '../utils/categoriaIcons';
import superiorBanner from '../assets/InicioBannerSuperior.png';
import inferiorBanner from '../assets/InicioBannerInferior.png';
import enviosIcon from '../assets/envios.png';
import productosIcon from '../assets/productoss.png';
import pedidosIcon from '../assets/pedidoss.png';
import retiroIcon from '../assets/retiro.png';
import '../styles/home.css';

const Home = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [productosData, categoriasData] = await Promise.all([
          apiFetch('/productos'),
          apiFetch('/categorias'),
        ]);
        setProductos(productosData || []);
        setCategorias(ordenarCategorias(categoriasData || []));
      } catch (error) {
        console.error('Error fetching productos:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const productosFiltrados = useMemo(() => {
    if (!categoriaId) return productos;
    return productos.filter((p) => (p.categorias || []).some((c) => String(c.id) === categoriaId));
  }, [productos, categoriaId]);

  const featured = productosFiltrados.slice(0, 6);

  return (
    <div className="home-page-container">
      <section className="home-hero-banner">
        <img src={superiorBanner} alt="Banner inicio superior" className="home-hero-image" />
        <div className="home-hero-actions">
          <button type="button" onClick={() => navigate('/productos')} className="home-hero-button">
            Ver productos
            <span className="home-button-icon home-button-icon-arrow" aria-hidden="true">›</span>
          </button>
          <button type="button" onClick={() => navigate('/productos')} className="home-hero-button home-hero-button-secondary">
            <span className="home-button-icon home-button-icon-cup" aria-hidden="true">☕</span>
            Armar mi merienda
          </button>
        </div>
      </section>

      <section className="home-categories">
        <button
          className={`pill${categoriaId === '' ? ' active' : ''}`}
          type="button"
          onClick={() => setCategoriaId('')}
        >
          <img src={iconTodos} alt="Todos" /> Todos
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.id}
            className={`pill${categoriaId === String(cat.id) ? ' active' : ''}`}
            type="button"
            onClick={() => setCategoriaId(String(cat.id))}
          >
            <img src={iconosPorCategoria[normalizar(cat.nombre)] || iconTodos} alt={cat.nombre} /> {cat.nombre}
          </button>
        ))}
      </section>

      <section className="home-featured-section">
        <div className="home-section-header">
          <div>
            <h2>Productos destacados</h2>
          </div>
          <button type="button" className="home-view-all" onClick={() => navigate('/productos')}>
            Ver todos los productos
          </button>
        </div>
        {featured.length > 0 ? (
          <div className="home-product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="home-loading">No hay productos disponibles por el momento.</p>
        )}
      </section>

      <section className="home-lower-banner">
        <img src={inferiorBanner} alt="Banner inicio inferior" className="home-lower-image" />
        <button type="button" onClick={() => navigate('/productos')} className="home-lower-button">
          Descubrir combos
          <span className="home-button-icon home-button-icon-arrow" aria-hidden="true">›</span>
        </button>
      </section>

      <section className="home-benefits-section">
        <div className="feature-item">
          <img src={enviosIcon} alt="Envíos en el día" className="feature-icon" />
          <div className="feature-text">
            <h4>Envíos en el día</h4>
            <p>Recibí tu pedido rápido y fresco.</p>
          </div>
        </div>
        <div className="feature-divider" />
        <div className="feature-item">
          <img src={productosIcon} alt="Productos frescos" className="feature-icon" />
          <div className="feature-text">
            <h4>Productos frescos</h4>
            <p>Elaboramos todos los días.</p>
          </div>
        </div>
        <div className="feature-divider" />
        <div className="feature-item">
          <img src={pedidosIcon} alt="Pedidos personalizados" className="feature-icon" />
          <div className="feature-text">
            <h4>Pedidos personalizados</h4>
            <p>Tortas y box a tu medida.</p>
          </div>
        </div>
        <div className="feature-divider" />
        <div className="feature-item">
          <img src={retiroIcon} alt="Retiro en tienda" className="feature-icon" />
          <div className="feature-text">
            <h4>Retiro en tienda</h4>
            <p>Pasá a buscar tu pedido.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
