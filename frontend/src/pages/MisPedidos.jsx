import { useMemo, useState } from 'react';
import PerfilLayout from '../components/PerfilLayout';
import '../styles/misPedidos.css';

// TODO: cuando exista un endpoint de pedidos en el backend (por ejemplo
// GET /api/pedidos/usuario/{id}), reemplazar estos datos de ejemplo por el historial real.
const haceDias = (dias) => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - dias);
  return fecha;
};

const PEDIDOS_MOCK = [
  {
    id: 1,
    numero: '12345',
    fecha: haceDias(3),
    hora: '10:32',
    entrega: 'domicilio',
    direccion: 'Av. Corrientes 1234, 4° B, Almagro, CP 1173',
    pago: 'Tarjeta de crédito •••• 4242',
    marcaTarjeta: 'VISA',
    estado: 'Entregado',
    envio: 3400,
    items: [
      { emoji: '🥐', nombre: 'Medialunas clásicas', detalle: 'Pack de 6 unidades', cantidad: 2, precio: 4200 },
      { emoji: '☕', nombre: 'Café Latte', detalle: 'Tamaño grande', cantidad: 1, precio: 3100 },
      { emoji: '🍰', nombre: 'Cheesecake de frutos rojos', detalle: 'Porción', cantidad: 1, precio: 6250 },
      { emoji: '🍪', nombre: 'Cookies de chocolate', detalle: 'Pack de 3 unidades', cantidad: 1, precio: 2800 },
      { emoji: '🥖', nombre: 'Budín de limón', detalle: 'Unidad', cantidad: 1, precio: 5100 },
    ],
  },
  {
    id: 2,
    numero: '12310',
    fecha: haceDias(10),
    hora: '17:05',
    entrega: 'tienda',
    direccion: 'Retiro en local — Av. Corrientes 1234',
    pago: 'Efectivo',
    estado: 'Entregado',
    envio: 0,
    items: [
      { emoji: '🍪', nombre: 'Cookies con chips', detalle: 'Pack de 6 unidades', cantidad: 1, precio: 15420 },
    ],
  },
];

const ESTADO_CLASE = {
  'Entregado': 'mp-badge-entregado',
  'En preparación': 'mp-badge-preparacion',
  'En camino': 'mp-badge-camino',
  'Listo para retirar': 'mp-badge-listo',
  'Cancelado': 'mp-badge-cancelado',
};

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const TruckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const StoreIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l1-5h16l1 5" /><path d="M3 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" /><path d="M4 9v10h16V9" />
  </svg>
);

const ChevronIcon = ({ up }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: up ? 'rotate(180deg)' : 'none' }}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ClipboardIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

const CardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ReorderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

const formatFecha = (fecha) =>
  fecha.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

const FECHA_OPCIONES = [
  { value: '', label: 'Todas las fechas' },
  { value: '30', label: 'Últimos 30 días' },
  { value: '90', label: 'Últimos 3 meses' },
  { value: '180', label: 'Últimos 6 meses' },
];

const MisPedidos = () => {
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [seleccionadoId, setSeleccionadoId] = useState(PEDIDOS_MOCK[0]?.id ?? null);
  const [verTodosProductos, setVerTodosProductos] = useState(false);

  const pedidosFiltrados = useMemo(() => {
    const ahora = Date.now();
    return PEDIDOS_MOCK.filter((p) => {
      const matchBusqueda = p.numero.includes(busqueda.trim());
      const matchEstado = !estadoFiltro || p.estado === estadoFiltro;
      const matchFecha = !fechaFiltro || (ahora - p.fecha.getTime()) / 86400000 <= Number(fechaFiltro);
      return matchBusqueda && matchEstado && matchFecha;
    });
  }, [busqueda, estadoFiltro, fechaFiltro]);

  const pedidoSeleccionado = pedidosFiltrados.find((p) => p.id === seleccionadoId) || null;

  const seleccionarPedido = (id) => {
    setSeleccionadoId((prev) => (prev === id ? null : id));
    setVerTodosProductos(false);
  };

  const calcularTotal = (pedido) => {
    const subtotal = pedido.items.reduce((acc, item) => acc + item.precio, 0);
    return { subtotal, total: subtotal + pedido.envio };
  };

  return (
    <PerfilLayout>
      <h2 className="perfil-title">Mis pedidos</h2>
      <p className="perfil-subtitle">Consultá el estado y el detalle de tus pedidos.</p>

      <div className="mp-filters-card">
        <div className="mp-search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Buscar por número de pedido..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="mp-filter-group">
          <label>Estado</label>
          <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
            <option value="">Todos los estados</option>
            {Object.keys(ESTADO_CLASE).map((estado) => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>
        <div className="mp-filter-group">
          <label><CalendarIcon /> Fecha</label>
          <select value={fechaFiltro} onChange={(e) => setFechaFiltro(e.target.value)}>
            {FECHA_OPCIONES.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
            ))}
          </select>
        </div>
      </div>

      {pedidosFiltrados.length === 0 ? (
        <div className="perfil-empty-state">
          <span className="perfil-empty-icon">🧾</span>
          <p className="perfil-empty-text">No se encontraron pedidos con esos filtros.</p>
        </div>
      ) : (
        <div className={`mp-layout${pedidoSeleccionado ? ' mp-layout-with-detail' : ''}`}>
          <div className="mp-list">
            {pedidosFiltrados.map((pedido) => {
              const activo = pedido.id === seleccionadoId;
              const { total } = calcularTotal(pedido);
              return (
                <div key={pedido.id} className={`mp-row${activo ? ' active' : ''}`} onClick={() => seleccionarPedido(pedido.id)}>
                  <div className="mp-row-info">
                    <p className="mp-row-numero">Pedido #{pedido.numero}</p>
                    <p className="mp-row-fecha">{formatFecha(pedido.fecha)}</p>
                  </div>

                  <div className="mp-row-thumbs">
                    {pedido.items.slice(0, 2).map((item, i) => (
                      <span className="mp-thumb" key={i}>{item.emoji}</span>
                    ))}
                    {pedido.items.length > 2 && <span className="mp-thumb-more">+{pedido.items.length - 2}</span>}
                  </div>

                  <p className="mp-row-total">${total.toLocaleString('es-AR')}</p>

                  <div className="mp-row-entrega">
                    {pedido.entrega === 'domicilio' ? <TruckIcon /> : <StoreIcon />}
                    <span>{pedido.entrega === 'domicilio' ? 'A domicilio' : 'En tienda'}</span>
                  </div>

                  <span className={`mp-badge ${ESTADO_CLASE[pedido.estado]}`}>{pedido.estado}</span>

                  <button type="button" className="mp-btn-detalle" onClick={(e) => { e.stopPropagation(); seleccionarPedido(pedido.id); }}>
                    Ver detalle
                  </button>

                  <span className="mp-chevron"><ChevronIcon up={activo} /></span>
                </div>
              );
            })}
          </div>

          {pedidoSeleccionado && (() => {
            const { subtotal, total } = calcularTotal(pedidoSeleccionado);
            const itemsVisibles = verTodosProductos ? pedidoSeleccionado.items : pedidoSeleccionado.items.slice(0, 4);
            return (
              <div className="mp-detail">
                <div className="mp-detail-header">
                  <span className="mp-detail-icon"><ClipboardIcon /></span>
                  <div className="mp-detail-header-text">
                    <h3>Pedido #{pedidoSeleccionado.numero}</h3>
                    <p>Realizado el {formatFecha(pedidoSeleccionado.fecha)} a las {pedidoSeleccionado.hora} hs</p>
                  </div>
                  <span className={`mp-badge ${ESTADO_CLASE[pedidoSeleccionado.estado]}`}>{pedidoSeleccionado.estado}</span>
                  <button type="button" className="mp-detail-close" onClick={() => setSeleccionadoId(null)} aria-label="Cerrar">
                    <CloseIcon />
                  </button>
                </div>

                <h4 className="mp-detail-subtitle">Productos</h4>
                <div className="mp-detail-items">
                  {itemsVisibles.map((item, i) => (
                    <div className="mp-detail-item" key={i}>
                      <span className="mp-thumb">{item.emoji}</span>
                      <div className="mp-detail-item-info">
                        <p>{item.cantidad} {item.nombre}</p>
                        <small>{item.detalle}</small>
                      </div>
                      <span className="mp-detail-item-precio">${item.precio.toLocaleString('es-AR')}</span>
                    </div>
                  ))}
                </div>

                {pedidoSeleccionado.items.length > 4 && (
                  <button type="button" className="mp-ver-todos" onClick={() => setVerTodosProductos((v) => !v)}>
                    {verTodosProductos ? 'Ver menos' : `Ver todos los productos (${pedidoSeleccionado.items.length})`} <ChevronIcon up={verTodosProductos} />
                  </button>
                )}

                <div className="mp-detail-row">
                  {pedidoSeleccionado.entrega === 'domicilio' ? <TruckIcon /> : <StoreIcon />}
                  <div>
                    <p className="mp-detail-row-label">Entrega</p>
                    <p className="mp-detail-row-value">{pedidoSeleccionado.direccion}</p>
                  </div>
                </div>

                <div className="mp-detail-row">
                  <CardIcon />
                  <div>
                    <p className="mp-detail-row-label">Pago</p>
                    <p className="mp-detail-row-value">{pedidoSeleccionado.pago}</p>
                  </div>
                  {pedidoSeleccionado.marcaTarjeta && <span className="mp-tarjeta-marca">{pedidoSeleccionado.marcaTarjeta}</span>}
                </div>

                <div className="mp-detail-resumen">
                  <p className="mp-detail-subtitle">Resumen</p>
                  <div className="mp-resumen-row"><span>Subtotal</span><span>${subtotal.toLocaleString('es-AR')}</span></div>
                  <div className="mp-resumen-row"><span>Envío</span><span>{pedidoSeleccionado.envio > 0 ? `$${pedidoSeleccionado.envio.toLocaleString('es-AR')}` : 'Gratis'}</span></div>
                  <div className="mp-resumen-row mp-resumen-total"><span>Total</span><span>${total.toLocaleString('es-AR')}</span></div>
                </div>

                <div className="mp-detail-actions">
                  <button type="button" className="mp-btn-secondary"><DownloadIcon /> Descargar factura</button>
                  <button type="button" className="mp-btn-primary"><ReorderIcon /> Volver a pedir</button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </PerfilLayout>
  );
};

export default MisPedidos;
