import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

// Agrega la clase "active" al link cuando su ruta coincide con la actual
const navLinkClass = ({ isActive }) =>
    `perfil-nav-link${isActive ? ' active' : ''}`;

const UserIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const OrdersIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
);

const PinIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
);

const CardIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
);

const HeartIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
);

const GearIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

const LogoutIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

// Menú lateral de la sección "Mi perfil" (perfil, pedidos, favoritos, logout)
const PerfilSidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <aside className="perfil-sidebar">
            <nav>
                <ul className="perfil-nav-list">
                    <li>
                        <NavLink to="/perfil" end className={navLinkClass}>
                            <UserIcon /> Mi perfil
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/mis-pedidos" className={navLinkClass}>
                            <OrdersIcon /> Mis pedidos
                        </NavLink>
                    </li>
                    <li>
                        <span className="perfil-nav-link perfil-nav-disabled" title="Proximamente">
                            <PinIcon /> Direcciones
                        </span>
                    </li>
                    <li>
                        <span className="perfil-nav-link perfil-nav-disabled" title="Proximamente">
                            <CardIcon /> Metodos de pago
                        </span>
                    </li>
                    <li>
                        <NavLink to="/favoritos" className={navLinkClass}>
                            <HeartIcon /> Mis Favoritos
                        </NavLink>
                    </li>
                    <li>
                        <span className="perfil-nav-link perfil-nav-disabled" title="Proximamente">
                            <GearIcon /> Configuracion
                        </span>
                    </li>
                    <li>
                        <button className="perfil-nav-link perfil-nav-logout" onClick={handleLogout}>
                            <LogoutIcon /> Cerrar Sesion
                        </button>
                    </li>
                </ul>
            </nav>

            <div className="perfil-help-box">
                <span className="perfil-help-icon" aria-hidden="true">🌱</span>
                <p className="perfil-help-title">¿Necesitás ayuda?</p>
                <p className="perfil-help-text">
                    Escribinos por <strong>WhatsApp</strong>
                </p>
                <a
                    className="perfil-help-btn"
                    href="https://wa.me/5491100000000"
                    target="_blank"
                    rel="noreferrer"
                >
                    Contactar
                </a>
            </div>
        </aside>
    );
};

export default PerfilSidebar;
