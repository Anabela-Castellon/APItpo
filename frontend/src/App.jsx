import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store/store";

import Navbar from "./components/Navbar";
import { CartProvider } from "./hooks/useContext/CartContext";

import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./components/Cart";
import Checkout from "./pages/Checkout";
import CartRedux from "./components/CartRedux";
import Perfil from "./pages/Perfil";
import MisPedidos from "./pages/MisPedidos";
import Favoritos from "./pages/Favoritos";
import Nosotros from "./pages/Nosotros";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminPlaceholder from "./pages/admin/AdminPlaceholder";

const RequireAuth = ({ children }) => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const location = useLocation();
    return isLoggedIn ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

const AppLayout = () => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    return (
        <>
            {!isAdmin && <Navbar />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Catalog />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/producto/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<RequireAuth><Cart /></RequireAuth>} />
                <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
                <Route path="/cart-redux" element={<CartRedux />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/mis-pedidos" element={<MisPedidos />} />
                <Route path="/favoritos" element={<Favoritos />} />

                <Route path="/admin" element={<AdminPlaceholder title="Dashboard" />} />
                <Route path="/admin/productos" element={<AdminProductos />} />
                <Route path="/admin/pedidos" element={<AdminPlaceholder title="Pedidos" />} />
                <Route path="/admin/categorias" element={<AdminPlaceholder title="Categorías" />} />
                <Route path="/admin/usuarios" element={<AdminPlaceholder title="Usuarios" />} />
                <Route path="/admin/clientes" element={<AdminPlaceholder title="Clientes" />} />
                <Route path="/admin/inventario" element={<AdminPlaceholder title="Inventario" />} />
                <Route path="/admin/promociones" element={<AdminPlaceholder title="Promociones" />} />
                <Route path="/admin/reportes" element={<AdminPlaceholder title="Reportes" />} />
                <Route path="/admin/configuracion" element={<AdminPlaceholder title="Configuración" />} />
            </Routes>
        </>
    );
};

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <CartProvider>
                    <Router>
                        <AppLayout />
                    </Router>
                </CartProvider>
            </PersistGate>
        </Provider>
    );
}

export default App;
