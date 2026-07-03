import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import { apiFetch } from '../services/api';

import bannerImage from '../assets/bannerCatProduct.png';
import enviosIcon from '../assets/envios.png';
import productosIcon from '../assets/productoss.png';
import pedidosIcon from '../assets/pedidoss.png';
import retiroIcon from '../assets/retiro.png';
import { normalizar, iconosPorCategoria, iconTodos, ordenarCategorias } from '../utils/categoriaIcons';

import '../styles/catalog.css';

const initialFiltros = {
  categoriaId: '',
  minPrice: '',
  maxPrice: '',
  soloDisponibles: false,
  sortBy: 'relevancia',
};

const Catalog = () => {
  const [searchParams] = useSearchParams();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [filtros, setFiltros] = useState(initialFiltros);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setSearch(q);
  }, [searchParams]);

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
        console.error('Error fetching catálogo:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const productosFiltrados = useMemo(() => {
    let resultado = [...productos];

    if (search.trim()) {
      const term = normalizar(search.trim());
      resultado = resultado.filter((p) => normalizar(p.nombre).includes(term));
    }

    if (filtros.categoriaId) {
      resultado = resultado.filter((p) =>
        (p.categorias || []).some((c) => String(c.id) === filtros.categoriaId)
      );
    }

    if (filtros.minPrice !== '') {
      resultado = resultado.filter((p) => p.precio >= Number(filtros.minPrice));
    }

    if (filtros.maxPrice !== '') {
      resultado = resultado.filter((p) => p.precio <= Number(filtros.maxPrice));
    }

    if (filtros.soloDisponibles) {
      resultado = resultado.filter((p) => (p.stock ?? 0) > 0);
    }

    if (filtros.sortBy === 'precio-asc') {
      resultado.sort((a, b) => a.precio - b.precio);
    } else if (filtros.sortBy === 'precio-desc') {
      resultado.sort((a, b) => b.precio - a.precio);
    }

    return resultado;
  }, [productos, search, filtros]);

  const handleClear = () => {
    setSearch('');
    setFiltros(initialFiltros);
  };

  return (
    <div className="page-container">

      <div className="catalog-banner">
        <img src={bannerImage} alt="Banner Catálogo" />
      </div>

      <div className="category-pills">
        <button
          className={`pill${filtros.categoriaId === '' ? ' active' : ''}`}
          onClick={() => setFiltros((f) => ({ ...f, categoriaId: '' }))}
        >
          <img src={iconTodos} alt="Todos" /> Todos
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.id}
            className={`pill${filtros.categoriaId === String(cat.id) ? ' active' : ''}`}
            onClick={() => setFiltros((f) => ({ ...f, categoriaId: String(cat.id) }))}
          >
            <img src={iconosPorCategoria[normalizar(cat.nombre)] || iconTodos} alt={cat.nombre} /> {cat.nombre}
          </button>
        ))}
      </div>

      <div className="catalog-layout">
        <Sidebar
          search={search}
          onSearchChange={setSearch}
          categorias={categorias}
          categoriaId={filtros.categoriaId}
          onCategoriaChange={(categoriaId) => setFiltros((f) => ({ ...f, categoriaId }))}
          minPrice={filtros.minPrice}
          maxPrice={filtros.maxPrice}
          onMinPriceChange={(minPrice) => setFiltros((f) => ({ ...f, minPrice }))}
          onMaxPriceChange={(maxPrice) => setFiltros((f) => ({ ...f, maxPrice }))}
          soloDisponibles={filtros.soloDisponibles}
          onSoloDisponiblesChange={(soloDisponibles) => setFiltros((f) => ({ ...f, soloDisponibles }))}
          sortBy={filtros.sortBy}
          onSortByChange={(sortBy) => setFiltros((f) => ({ ...f, sortBy }))}
          onClear={handleClear}
        />

        <div className="product-grid">
          {cargando ? (
            <p>Cargando productos...</p>
          ) : productosFiltrados.length > 0 ? (
            productosFiltrados.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))
          ) : (
            <p style={{ gridColumn: "1 / -1", textAlign: "center", marginTop: "2rem" }}>
              No se encontraron productos con esos filtros.
            </p>
          )}
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

export default Catalog;
