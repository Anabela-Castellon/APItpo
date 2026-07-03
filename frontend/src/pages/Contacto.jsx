import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import bannerContacto from '../assets/bannerContacto.png';
import trigoLogo from '../assets/trigoLogo.png';
import { crearConsulta } from '../store/consultasSlice';
import '../styles/contacto.css';

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16v16H4z" /><path d="M22 6 12 13 2 6" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const PinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const WhatsappIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const emptyForm = { nombre: '', email: '', asunto: '', mensaje: '' };

const Contacto = () => {
  const dispatch = useDispatch();
  const { enviando } = useSelector((state) => state.consultas);
  const [form, setForm] = useState(emptyForm);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setEnviado(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.mensaje) return;

    try {
      await dispatch(crearConsulta(form)).unwrap();
      setEnviado(true);
      setForm(emptyForm);
    } catch (err) {
      setError(err || 'No se pudo enviar tu consulta. Intentá nuevamente.');
    }
  };

  return (
    <div className="page-container contacto-page">
      <section className="contacto-hero">
        <img src={bannerContacto} alt="Contacto" className="contacto-hero-img" />
      </section>

      <div className="contacto-grid">
        <div className="contacto-info-col">
          <div className="contacto-card">
            <div className="contacto-info-item">
              <span className="contacto-info-icon contacto-icon-pink"><EmailIcon /></span>
              <div>
                <h4>Email</h4>
                <p>hola@laesquina.com.ar</p>
              </div>
            </div>
            <div className="contacto-info-item">
              <span className="contacto-info-icon contacto-icon-green"><PhoneIcon /></span>
              <div>
                <h4>Teléfono / WhatsApp</h4>
                <p>+54 11 1234 5678</p>
              </div>
            </div>
            <div className="contacto-info-item">
              <span className="contacto-info-icon contacto-icon-yellow"><PinIcon /></span>
              <div>
                <h4>Dirección</h4>
                <p>Av. Corrientes 1234, Palermo, Buenos Aires</p>
              </div>
            </div>
            <div className="contacto-info-item contacto-info-item-last">
              <span className="contacto-info-icon contacto-icon-pink"><ClockIcon /></span>
              <div>
                <h4>Horarios de atención</h4>
                <p>Lunes a Domingo de 8:00 a 20:00 hs</p>
              </div>
            </div>
          </div>

          <div className="contacto-map">
            <iframe
              title="Ubicación La Esquina"
              src="https://www.google.com/maps?q=Av.+Corrientes+1234,+Palermo,+Buenos+Aires&output=embed"
              width="100%"
              height="220"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>

          <div className="contacto-card contacto-social-card">
            <div>
              <h4>Seguinos en redes</h4>
              <p>Novedades, promociones y mucho más.</p>
            </div>
            <div className="contacto-social-icons">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="contacto-social-btn" title="Instagram"><InstagramIcon /></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="contacto-social-btn" title="Facebook"><FacebookIcon /></a>
              <a href="https://wa.me/5491112345678" target="_blank" rel="noreferrer" className="contacto-social-btn" title="WhatsApp"><WhatsappIcon /></a>
            </div>
          </div>
        </div>

        <div className="contacto-card contacto-form-card">
          <div className="contacto-form-header">
            <img src={trigoLogo} alt="" className="contacto-form-leaf" />
            <div>
              <h3>Envíanos tu consulta</h3>
              <p>Completá el formulario y te responderemos lo antes posible.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contacto-form">
            <div className="contacto-form-row">
              <label>
                Nombre
                <input type="text" placeholder="Tu nombre" value={form.nombre} onChange={handleChange('nombre')} required />
              </label>
              <label>
                Email
                <input type="email" placeholder="tu@email.com" value={form.email} onChange={handleChange('email')} required />
              </label>
            </div>

            <label>
              Asunto
              <input type="text" placeholder="¿En qué podemos ayudarte?" value={form.asunto} onChange={handleChange('asunto')} />
            </label>

            <label>
              Mensaje
              <textarea rows={6} placeholder="Contanos tu consulta..." value={form.mensaje} onChange={handleChange('mensaje')} required />
            </label>

            <button type="submit" className="contacto-btn-enviar" disabled={enviando}>
              <SendIcon /> {enviando ? 'Enviando...' : 'Enviar mensaje'}
            </button>

            {enviado && <p className="contacto-form-success">¡Gracias! Tu consulta fue enviada, te responderemos a la brevedad.</p>}
            {error && <p className="contacto-form-error">{error}</p>}

            <p className="contacto-form-footnote">
              <LockIcon /> Tus datos están protegidos y no serán compartidos.
            </p>
          </form>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-item">
          <span className="contacto-info-icon contacto-icon-green"><PhoneIcon /></span>
          <div className="feature-text">
            <h4>Envíos en el día</h4>
            <p>Recibí tu pedido rápido y fresco.</p>
          </div>
        </div>
        <div className="feature-divider"></div>
        <div className="feature-item">
          <span className="contacto-info-icon contacto-icon-yellow"><ClockIcon /></span>
          <div className="feature-text">
            <h4>Productos frescos</h4>
            <p>Elaboramos todos los días.</p>
          </div>
        </div>
        <div className="feature-divider"></div>
        <div className="feature-item">
          <span className="contacto-info-icon contacto-icon-pink"><EmailIcon /></span>
          <div className="feature-text">
            <h4>Pedidos personalizados</h4>
            <p>Tortas y box a tu medida.</p>
          </div>
        </div>
        <div className="feature-divider"></div>
        <div className="feature-item">
          <span className="contacto-info-icon contacto-icon-green"><PinIcon /></span>
          <div className="feature-text">
            <h4>Retiro en tienda</h4>
            <p>Pasá a buscar tu pedido.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
