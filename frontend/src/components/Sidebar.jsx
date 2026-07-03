import React from 'react';

const PRECIO_MAX = 10000;

const Sidebar = ({
  search,
  onSearchChange,
  categorias,
  categoriaId,
  onCategoriaChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  soloDisponibles,
  onSoloDisponiblesChange,
  sortBy,
  onSortByChange,
  onClear,
}) => {
  const minValue = minPrice === '' ? 0 : Number(minPrice);
  const maxValue = maxPrice === '' ? PRECIO_MAX : Number(maxPrice);

  return (
    <aside className="sidebar">
      <div>
        <h4>Buscar producto</h4>
        <div className="sidebar-input-wrapper">
          <input
            type="text"
            placeholder="Ej.: medialunas, latte..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <span className="sidebar-input-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
        </div>
      </div>

      <div>
        <h4>Categorías</h4>
        <select value={categoriaId} onChange={(e) => onCategoriaChange(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
      </div>

      <div>
        <h4>Rango de precio</h4>
        <div className="price-slider">
          <input
            type="range"
            min="0"
            max={PRECIO_MAX}
            value={Math.min(minValue, maxValue)}
            onChange={(e) => onMinPriceChange(e.target.value)}
          />
          <input
            type="range"
            min="0"
            max={PRECIO_MAX}
            value={Math.max(minValue, maxValue)}
            onChange={(e) => onMaxPriceChange(e.target.value)}
          />
          <div className="price-slider-track"></div>
          <div
            className="price-slider-range"
            style={{
              left: `${(Math.min(minValue, maxValue) / PRECIO_MAX) * 100}%`,
              right: `${100 - (Math.max(minValue, maxValue) / PRECIO_MAX) * 100}%`,
            }}
          ></div>
        </div>
        <div className="price-range">
          <input
            type="number"
            min="0"
            placeholder="$0"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
          />
          <span>-</span>
          <input
            type="number"
            min="0"
            placeholder="$10.000"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
          />
        </div>
      </div>

      <div>
        <h4>Disponibilidad</h4>
        <label className="sidebar-checkbox-label" title="Todos los productos mostrados corresponden al stock de hoy">
          <input type="checkbox" checked disabled />
          <span className="dot"></span> Disponible hoy
        </label>
        <label className="sidebar-checkbox-label">
          <input
            type="checkbox"
            checked={soloDisponibles}
            onChange={(e) => onSoloDisponiblesChange(e.target.checked)}
          />
          Solo ver disponibles
        </label>
      </div>

      <div>
        <h4>Ordenar por</h4>
        <select value={sortBy} onChange={(e) => onSortByChange(e.target.value)}>
          <option value="relevancia">Más vendidos</option>
          <option value="precio-asc">Menor precio</option>
          <option value="precio-desc">Mayor precio</option>
        </select>
      </div>

      <button className="btn-limpiar" onClick={onClear}>↺ Limpiar filtros</button>
    </aside>
  );
};

export default Sidebar;
