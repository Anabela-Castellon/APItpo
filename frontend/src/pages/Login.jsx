import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/authSlice';

import trigoLogo from '../assets/trigoLogo.png';
import loginBanner from '../assets/loginBanner.png';

import productosIcon from '../assets/productoss.png';
import retiroIcon from '../assets/retiro.png';
import enviosIcon from '../assets/envios.png';
import pedidosIcon from '../assets/pedidoss.png';

import '../styles/login.css';

// Página de login: formulario de email/contraseña que despacha el thunk loginUser
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Intenta loguear; si el thunk falla, muestra alerta de credenciales incorrectas
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
      alert('Credenciales incorrectas');
    }
  };

  // Alterna entre mostrar la contraseña en texto plano o oculta
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-hero" style={{ backgroundImage: `url(${loginBanner})` }}>
        <div className="login-container">
          <div className="login-card">
            <div className="login-logo-container">
              <img src={trigoLogo} alt="Logo Trigo" className="login-trigo-logo" />
            </div>

            <h2 className="login-title">Iniciar Sesion</h2>

            <form onSubmit={handleLogin} className="login-form">
              <div className="input-group">
                <label htmlFor="email">Mail</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Ingresa tu correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Contrasena</label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingresa tu contrasena"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-btn">Ingresar</button>
            </form>

            <p className="login-footer-text">
              No tenes cuenta? <Link to="/register" className="login-link">Registrate</Link>
            </p>
          </div>
        </div>
      </div>

      <div className="features-container">
        <div className="features-section-login">
          <div className="feature-item-login">
            <img src={productosIcon} alt="Productos frescos" className="feature-icon-login" />
            <div className="feature-text-login">
              <h4>Productos frescos</h4>
              <p>Elaboramos todos los dias.</p>
            </div>
          </div>
          <div className="feature-divider-login"></div>

          <div className="feature-item-login">
            <img src={retiroIcon} alt="Retiro en tienda" className="feature-icon-login" />
            <div className="feature-text-login">
              <h4>Retiro en tienda</h4>
              <p>Pasa a buscar tu pedido.</p>
            </div>
          </div>
          <div className="feature-divider-login"></div>

          <div className="feature-item-login">
            <img src={enviosIcon} alt="Envios en el dia" className="feature-icon-login" />
            <div className="feature-text-login">
              <h4>Envios en el dia</h4>
              <p>Recibi tu pedido rapido y fresco.</p>
            </div>
          </div>
          <div className="feature-divider-login"></div>

          <div className="feature-item-login">
            <img src={pedidosIcon} alt="Pedidos personalizados" className="feature-icon-login" />
            <div className="feature-text-login">
              <h4>Pedidos personalizados</h4>
              <p>Tortas y box a tu medida.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
