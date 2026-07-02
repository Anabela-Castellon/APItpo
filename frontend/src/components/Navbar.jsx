import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../assets/laEsquinaLogo.png';
import { useCart } from '../hooks/useContext/CartContext';
import { logout } from '../store/authSlice';
import '../styles/navbar.css';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const Navbar = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isAdmin = useSelector((state) => state.auth.roles?.includes('ROLE_ADMIN'));
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState(searchParams.get('q') || '');
  const menuRef = useRef(null);

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
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/productos${busqueda ? `?q=${encodeURIComponent(busqueda)}` : ''}`);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="La Esquina Bakery" />
        </Link>
      </div>

      <ul className="navbar-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active-link' : ''}>
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink to="/productos" className={({ isActive }) => isActive ? 'active-link' : ''}>
            Productos
          </NavLink>
        </li>
        <li>
          <NavLink to="/nosotros" className={({ isActive }) => isActive ? 'active-link' : ''}>
            Nosotros
          </NavLink>
        </li>
        <li>
          <NavLink to="/contacto" className={({ isActive }) => isActive ? 'active-link' : ''}>
            Contacto
          </NavLink>
        </li>
      </ul>

      <div className="navbar-actions">
        <form className="navbar-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button type="submit" aria-label="Buscar">
            <SearchIcon />
          </button>
        </form>

        {isLoggedIn ? (
          <div className="nav-user-menu" ref={menuRef}>
            <button
              className="nav-circle-btn"
              onClick={() => setMenuAbierto(!menuAbierto)}
              title="Mi Cuenta"
            >
              <UserIcon />
            </button>
            {menuAbierto && (
              <div className="user-dropdown">
                <Link to="/perfil" className="dropdown-item" onClick={() => setMenuAbierto(false)}>
                  Mi perfil
                </Link>
                <Link to="/mis-pedidos" className="dropdown-item" onClick={() => setMenuAbierto(false)}>
                  Mis pedidos
                </Link>
                <Link to="/favoritos" className="dropdown-item" onClick={() => setMenuAbierto(false)}>
                  Mis favoritos
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="dropdown-item" onClick={() => setMenuAbierto(false)}>
                    Admin
                  </Link>
                )}
                <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                  Cerrar sesion
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="nav-circle-btn" title="Iniciar sesion">
            <UserIcon />
          </Link>
        )}

        <Link
          to={isLoggedIn ? "/cart" : "/login"}
          className="nav-circle-btn nav-cart"
          title={isLoggedIn ? "Carrito" : "Iniciar sesión para ver el carrito"}
        >
          <CartIcon />
          {isLoggedIn && totalItems > 0 && (
            <span className="cart-badge">{totalItems}</span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
