import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import AdminSidebar from './AdminSidebar';
import '../../styles/admin.css';

const AdminLayout = ({ title, children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setMenuAbierto(false);
    navigate('/login');
  };

  if (!isLoggedIn) return null;

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <span className="admin-topbar-toggle" aria-hidden="true">☰</span>
            <h1>{title}</h1>
          </div>
          <div className="admin-topbar-right">
            <div className="admin-search">
              <input type="text" placeholder="Buscar pedidos, productos, usuarios..." />
              <span aria-hidden="true">🔍</span>
            </div>
            <button className="admin-bell" title="Notificaciones" aria-label="Notificaciones">
              🔔
            </button>
            <div className="admin-user-menu" ref={menuRef}>
              <button className="admin-user" onClick={() => setMenuAbierto((v) => !v)}>
                <div className="admin-avatar" aria-hidden="true">A</div>
                <div>
                  <p className="admin-user-name">Admin</p>
                  <p className="admin-user-role">Administrador</p>
                </div>
              </button>
              {menuAbierto && (
                <div className="admin-user-dropdown">
                  <Link to="/" className="admin-dropdown-item" onClick={() => setMenuAbierto(false)}>
                    Volver a la tienda
                  </Link>
                  <button className="admin-dropdown-item admin-dropdown-logout" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
