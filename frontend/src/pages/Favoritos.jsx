import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PerfilLayout from '../components/PerfilLayout';
import ProductCard from '../components/ProductCard';

// Página de favoritos: lista los productos guardados por el usuario (persistidos en localStorage)
const Favoritos = () => {
    const favoritos = useSelector((state) => state.favoritos.items);

    return (
        <PerfilLayout>
            <h2 className="perfil-title">Mis Favoritos</h2>
            <p className="perfil-subtitle">
                Guardá tus productos preferidos para volver a pedirlos cuando quieras.
            </p>

            {favoritos.length === 0 ? (
                <div className="perfil-empty-state">
                    <span className="perfil-empty-icon">🤍</span>
                    <p className="perfil-empty-text">Tu lista de favoritos está vacía en este momento.</p>
                    <Link to="/productos" className="perfil-empty-cta">
                        Explorar Catálogo
                    </Link>
                </div>
            ) : (
                <div className="perfil-products-grid">
                    {favoritos.map((producto) => (
                        <ProductCard key={producto.id} product={producto} />
                    ))}
                </div>
            )}
        </PerfilLayout>
    );
};

export default Favoritos;