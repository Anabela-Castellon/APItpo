import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useContext/CartContext';
import { toggleFavorito } from '../store/favoritosSlice';
import { useDispatch, useSelector } from "react-redux";
import { getImagenUrl } from '../services/api';
import faheart from '../assets/heart-solid-full.svg';
import faheartn from '../assets/heart-regular-full.svg'

const ProductCard = ({ product }) => {
    const { addToCart, cartItems } = useCart();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    const esFavorito = useSelector((state) =>
        isLoggedIn && state.favoritos.items.some((item) => item.id === Number(product.id))
    );

    const enCarrito = cartItems.find((item) => item.id === product.id)?.quantity || 0;
    const sinStock = product.stock !== undefined && product.stock <= 0;
    const alcanzoLimite = product.stock !== undefined && enCarrito >= product.stock;
    const primeraImagen = product.imagenes?.[0];

    const handleToggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        dispatch(toggleFavorito(product));
    };

    return (
        <div className="product-card">
            <div className="product-image-container">
                <Link to={`/producto/${product.id}`} className="product-card-link">
                    {primeraImagen ? (
                        <img src={getImagenUrl(product.id, primeraImagen.id)} alt={product.nombre} className="product-img" />
                    ) : (
                        <div className="product-img-placeholder" aria-hidden="true">🎂</div>
                    )}
                </Link>

                <button
                    type="button"
                    className="product-fav-btn"
                    onClick={handleToggleFavorite}
                    title={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                    <img src={esFavorito ? faheart : faheartn} alt="" style={{ width: '20px', height: '20px' }} />
                </button>
            </div>

            <div className="product-info">
                <Link to={`/producto/${product.id}`} className="product-card-link">
                    <h3>{product.nombre}</h3>
                </Link>
                <div className="product-info-row">
                    <div>
                        <span className="price">${product.precio.toLocaleString('es-AR')}</span>
                        <div className="availability">
                            <span className="dot"></span> {sinStock ? 'Sin stock' : 'Disponible hoy'}
                        </div>
                    </div>

                    <button
                        className="btn-add"
                        onClick={() => addToCart(product)}
                        title={alcanzoLimite ? 'Alcanzaste el stock disponible' : 'Agregar al carrito'}
                        disabled={sinStock || alcanzoLimite}
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
