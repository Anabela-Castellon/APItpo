import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PerfilSidebar from './PerfilSidebar';
import '../styles/perfil.css';

// Layout compartido de las páginas de perfil (Mi perfil, Mis pedidos, Favoritos): sidebar + contenido
const PerfilLayout = ({ children }) => {
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    // Si no hay sesión, redirige al login
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="page-container perfil-container">
            <PerfilSidebar />
            <main className="perfil-content">{children}</main>
        </div>
    );
};

export default PerfilLayout;
