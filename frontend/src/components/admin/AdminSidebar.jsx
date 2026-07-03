import { NavLink } from 'react-router-dom';
import logo from '../../assets/laEsquinaLogo.png';

const navLinkClass = ({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`;

const navItems = [
  { to: '/admin', end: true, icon: '🏠', label: 'Dashboard' },
  { to: '/admin/pedidos', icon: '🛍️', label: 'Pedidos' },
  { to: '/admin/productos', icon: '🥐', label: 'Productos' },
  { to: '/admin/categorias', icon: '🏷️', label: 'Categorías' },
  { to: '/admin/usuarios', icon: '👥', label: 'Usuarios' },
  { to: '/admin/clientes', icon: '👤', label: 'Clientes' },
  { to: '/admin/consultas', icon: '✉️', label: 'Consultas' },
  { to: '/admin/inventario', icon: '📦', label: 'Inventario' },
  { to: '/admin/promociones', icon: '🏷️', label: 'Promociones' },
  { to: '/admin/reportes', icon: '📊', label: 'Reportes' },
  { to: '/admin/configuracion', icon: '⚙️', label: 'Configuración' },
];

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <img src={logo} alt="La Esquina" />
      </div>

      <nav className="admin-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.end} className={navLinkClass}>
                <span className="admin-nav-icon" aria-hidden="true">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="admin-help-box">
        <span className="admin-help-icon" aria-hidden="true">🌱</span>
        <p className="admin-help-title">¿Necesitás ayuda?</p>
        <p className="admin-help-text">
          Escribinos por <strong>WhatsApp</strong>
        </p>
        <a
          className="admin-help-btn"
          href="https://wa.me/5491100000000"
          target="_blank"
          rel="noreferrer"
        >
          Contactar soporte
        </a>
      </div>
    </aside>
  );
};

export default AdminSidebar;
