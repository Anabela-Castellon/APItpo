import { Link, useNavigate } from 'react-router-dom';
// Eliminamos useCart
import { toggleFavorito } from '../store/favoritosSlice';
import { useDispatch, useSelector } from "react-redux";
import { getImagenUrl } from '../services/api';
import faheart from '../assets/heart-solid-full.svg';
import faheartn from '../assets/heart-regular-full.svg';

// Importamos la acción de Redux para agregar al carrito
import { addProductoToCart } from '../store/cartSlice';

// Tarjeta de producto (usada en Home, Catálogo y Favoritos): imagen, precio, favorito y agregar al carrito
const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    // Traemos los items del carrito desde Redux en lugar del context
    const cartItems = useSelector((state) => state.cart.items) || [];

    const esFavorito = useSelector((state) =>
        isLoggedIn && state.favoritos.items.some((item) => item.id === Number(product.id))
    );

    // Buscamos la cantidad actual que hay de este producto en el carrito
    // (item.producto.id es el producto real; item.id es el id del ItemCarrito)
    const itemEnCarrito = cartItems.find((item) => (item.producto?.id ?? item.id) === product.id);
    const enCarrito = itemEnCarrito?.cantidad ?? itemEnCarrito?.quantity ?? 0;
                      
    const sinStock = product.stock !== undefined && product.stock <= 0;
    const alcanzoLimite = product.stock !== undefined && enCarrito >= product.stock;
    const primeraImagen = product.imagenes?.[0];

    // Alterna favorito; si no hay sesión, manda al login en vez de despachar la acción
    const handleToggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        dispatch(toggleFavorito(product));
    };

    // Agrega una unidad del producto al carrito (vía API)
    const handleAddToCart = () => {
        // Despachamos el thunk que le pega al endpoint POST
        dispatch(addProductoToCart({ productoId: product.id, cantidad: 1 }));
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
                        onClick={handleAddToCart}
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