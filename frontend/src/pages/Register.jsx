import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';

import trigoLogo from '../assets/trigoLogo.png';
import registerBanner from '../assets/registerBanner.png';

import productosIcon from '../assets/productoss.png';
import retiroIcon from '../assets/retiro.png';
import enviosIcon from '../assets/envios.png';
import pedidosIcon from '../assets/pedidoss.png';

import '../styles/login.css';
import '../styles/register.css';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    direccion: '',
    rol: 'COMPRADOR',
    claveMaestra: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const payload = {
      email: form.email,
      contraseña: form.password,
      nombre: form.nombre,
      apellido: form.apellido,
      dni: form.dni,
      telefono: form.telefono,
      direccion: form.direccion,
      claveMaestra: form.claveMaestra
    };

    const endpointPorRol = {
      COMPRADOR: '/api/auth/register',
      VENDEDOR: '/api/auth/register/vendedor',
      ADMIN: '/api/auth/register/admin'
    };

    try {
      const response = await fetch(`http://localhost:8080${endpointPorRol[form.rol]}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const token = await response.text();
        dispatch(setCredentials(token));
        navigate('/');
      } else {
        const msg = await response.text();
        setError(msg || 'Error al registrarse');
      }
    } catch {
      setError('No se pudo conectar con el servidor');
    }
  };

  return (
    <div className="register-page">
      <section className="register-hero" style={{ backgroundImage: `url(${registerBanner})` }}>
        <div className="register-container">
          <div className="register-card">
            <div className="register-logo-container">
              <img src={trigoLogo} alt="Logo Trigo" className="register-trigo-logo" />
            </div>

            <h2 className="register-title">Crear cuenta</h2>
            <p className="register-subtitle">Registrate para guardar tus pedidos favoritos y comprar más rápido.</p>

            {error && <p className="register-error">{error}</p>}

            <form onSubmit={handleSubmit} className="register-form">
              <div className="register-row">
                <div className="register-input-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    id="nombre"
                    name="nombre"
                    placeholder="Tu nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="register-input-group">
                  <label htmlFor="apellido">Apellido</label>
                  <input
                    id="apellido"
                    name="apellido"
                    placeholder="Tu apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="register-input-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="register-row">
                <div className="register-input-group">
                  <label htmlFor="dni">DNI</label>
                  <input
                    id="dni"
                    name="dni"
                    inputMode="numeric"
                    placeholder="12 345 678"
                    value={form.dni}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="register-input-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    placeholder="+54 11 1234 5678"
                    value={form.telefono}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="register-input-group">
                <label htmlFor="rol">Tipo de cuenta</label>
                <select id="rol" name="rol" value={form.rol} onChange={handleChange} required>
                  <option value="COMPRADOR">Comprador</option>
                  <option value="VENDEDOR">Vendedor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              {form.rol === 'ADMIN' && (
                <div className="register-input-group">
                  <label htmlFor="claveMaestra">Clave maestra de administrador</label>
                  <input
                    id="claveMaestra"
                    name="claveMaestra"
                    type="password"
                    placeholder="Ingresá la clave maestra"
                    value={form.claveMaestra}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="register-input-group">
                <label htmlFor="direccion">Dirección</label>
                <input
                  id="direccion"
                  name="direccion"
                  placeholder="Calle, número y localidad"
                  value={form.direccion}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="register-input-group">
                <label htmlFor="password">Contraseña</label>
                <div className="register-password-wrapper">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="register-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="register-input-group">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <div className="register-password-wrapper">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="********"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="register-toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <label className="register-terms">
                <input type="checkbox" required />
                <span>Acepto los <Link to="#" className="register-link">Términos y Condiciones</Link></span>
              </label>

              <button type="submit" className="register-btn">
                Crear cuenta
                <span aria-hidden="true">→</span>
              </button>
            </form>

            <p className="register-footer-text">
              ¿Ya tenés cuenta? <Link to="/login" className="register-link">Iniciá sesión</Link>
            </p>
          </div>

        </div>
      </section>

      <div className="features-container">
        <div className="features-section-login">
          <div className="feature-item-login">
            <img src={productosIcon} alt="Productos frescos" className="feature-icon-login" />
            <div className="feature-text-login">
              <h4>Productos frescos</h4>
              <p>Elaboramos todos los días.</p>
            </div>
          </div>
          <div className="feature-divider-login"></div>

          <div className="feature-item-login">
            <img src={retiroIcon} alt="Retiro en tienda" className="feature-icon-login" />
            <div className="feature-text-login">
              <h4>Retiro en tienda</h4>
              <p>Pasá a buscar tu pedido.</p>
            </div>
          </div>
          <div className="feature-divider-login"></div>

          <div className="feature-item-login">
            <img src={enviosIcon} alt="Envíos en el día" className="feature-icon-login" />
            <div className="feature-text-login">
              <h4>Envíos en el día</h4>
              <p>Recibí tu pedido rápido y fresco.</p>
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

export default Register;
