import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PerfilLayout from '../components/PerfilLayout';
import { apiFetch } from '../services/api';

const EditIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />
    </svg>
);

const BellIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const MailIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16v16H4z" /><path d="M22 6 12 13 2 6" />
    </svg>
);

const UserIcon = () => (
    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const HomeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const emptyForm = { nombre: '', apellido: '', telefono: '', direccion: '' };

// Página "Mi perfil": muestra y permite editar los datos personales del usuario logueado (endpoint /me)
const Perfil = () => {
    const [perfil, setPerfil] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [cargando, setCargando] = useState(true);
    const [editando, setEditando] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');
    const [notificaciones, setNotificaciones] = useState(true);
    const [emails, setEmails] = useState(true);

    // Carga el perfil propio al entrar a la página
    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const data = await apiFetch('/perfiles/me');
                setPerfil(data);
                setForm({
                    nombre: data.nombre || '',
                    apellido: data.apellido || '',
                    telefono: data.telefono || '',
                    direccion: data.direccion || '',
                });
            } catch (err) {
                setError('No se pudo cargar tu perfil.');
            } finally {
                setCargando(false);
            }
        };
        cargarPerfil();
    }, []);

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    // Guarda los cambios del formulario contra el backend y sale del modo edición
    const handleGuardar = async (e) => {
        e.preventDefault();
        setGuardando(true);
        setError('');
        try {
            const data = await apiFetch('/perfiles/me', {
                method: 'PUT',
                body: JSON.stringify(form),
            });
            setPerfil(data);
            setEditando(false);
        } catch (err) {
            setError('No se pudieron guardar los cambios.');
        } finally {
            setGuardando(false);
        }
    };

    // Descarta los cambios sin guardar, volviendo el formulario a los datos actuales del perfil
    const handleCancelar = () => {
        setForm({
            nombre: perfil?.nombre || '',
            apellido: perfil?.apellido || '',
            telefono: perfil?.telefono || '',
            direccion: perfil?.direccion || '',
        });
        setEditando(false);
    };

    if (cargando) return <p style={{ padding: '2rem' }}>Cargando perfil...</p>;

    const nombreCompleto = [perfil?.nombre, perfil?.apellido].filter(Boolean).join(' ') || perfil?.email;

    return (
        <PerfilLayout>
            <h2 className="perfil-title">Mi perfil</h2>
            <p className="perfil-subtitle">Gestioná tu información personal y preferencias.</p>

            {error && <p className="perfil-error">{error}</p>}

            <div className="perfil-grid">
                <div className="perfil-main-col">
                    <div className="perfil-card">
                        <div className="perfil-card-header">
                            <h3>Información personal</h3>
                            {!editando && (
                                <button type="button" className="perfil-btn-editar" onClick={() => setEditando(true)}>
                                    <EditIcon /> Editar
                                </button>
                            )}
                        </div>

                        <div className="perfil-avatar-row">
                            <span className="perfil-avatar"><UserIcon /></span>
                            <div>
                                <p className="perfil-avatar-name">{nombreCompleto}</p>
                                <p className="perfil-avatar-detail">{perfil?.email}</p>
                                {form.telefono && <p className="perfil-avatar-detail">{form.telefono}</p>}
                            </div>
                        </div>

                        <form onSubmit={handleGuardar} className="perfil-form">
                            <div className="perfil-form-row">
                                <label>
                                    Nombre
                                    <input type="text" value={form.nombre} onChange={handleChange('nombre')} readOnly={!editando} required />
                                </label>
                                <label>
                                    Apellido
                                    <input type="text" value={form.apellido} onChange={handleChange('apellido')} readOnly={!editando} required />
                                </label>
                            </div>
                            <div className="perfil-form-row">
                                <label>
                                    Email
                                    <input type="email" value={perfil?.email || ''} readOnly disabled />
                                </label>
                                <label>
                                    Teléfono
                                    <input type="tel" value={form.telefono} onChange={handleChange('telefono')} readOnly={!editando} />
                                </label>
                            </div>
                            <label>
                                Dirección
                                <input type="text" value={form.direccion} onChange={handleChange('direccion')} readOnly={!editando} />
                            </label>

                            {editando && (
                                <div className="perfil-form-actions">
                                    <button type="button" className="perfil-btn-secondary" onClick={handleCancelar}>Cancelar</button>
                                    <button type="submit" className="perfil-btn-primary" disabled={guardando}>
                                        {guardando ? 'Guardando...' : 'Guardar cambios'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="perfil-card">
                        <div className="perfil-card-header">
                            <h3>Preferencias</h3>
                        </div>

                        <div className="perfil-pref-row">
                            <span className="perfil-pref-icon"><BellIcon /></span>
                            <div className="perfil-pref-text">
                                <p>Notificaciones</p>
                                <small>Recibí novedades y promociones exclusivas</small>
                            </div>
                            <button
                                type="button"
                                className={`perfil-toggle${notificaciones ? ' active' : ''}`}
                                onClick={() => setNotificaciones((v) => !v)}
                                aria-pressed={notificaciones}
                            >
                                <span className="perfil-toggle-thumb" />
                            </button>
                        </div>

                        <div className="perfil-pref-row perfil-pref-row-last">
                            <span className="perfil-pref-icon"><MailIcon /></span>
                            <div className="perfil-pref-text">
                                <p>Emails</p>
                                <small>Recibí el resumen de tus pedidos por email</small>
                            </div>
                            <button
                                type="button"
                                className={`perfil-toggle${emails ? ' active' : ''}`}
                                onClick={() => setEmails((v) => !v)}
                                aria-pressed={emails}
                            >
                                <span className="perfil-toggle-thumb" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="perfil-side-col">
                    <div className="perfil-card">
                        <div className="perfil-card-header">
                            <h3>Mis pedidos recientes</h3>
                            <Link to="/mis-pedidos" className="perfil-ver-todos">Ver todos</Link>
                        </div>
                        <p className="perfil-side-empty">Todavía no realizaste ningún pedido.</p>
                    </div>

                    <div className="perfil-card">
                        <div className="perfil-card-header">
                            <h3>Mis direcciones</h3>
                        </div>
                        {form.direccion ? (
                            <div className="perfil-direccion-item">
                                <span className="perfil-direccion-icon"><HomeIcon /></span>
                                <div>
                                    <span className="perfil-direccion-badge">Principal</span>
                                    <p>{form.direccion}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="perfil-side-empty">Todavía no agregaste una dirección.</p>
                        )}
                        <button type="button" className="perfil-add-direccion" onClick={() => setEditando(true)}>
                            + Agregar dirección
                        </button>
                    </div>
                </div>
            </div>

            <div className="perfil-puntos-banner">
                <div>
                    <span className="perfil-puntos-icon" aria-hidden="true">🌱</span>
                    <div>
                        <p className="perfil-puntos-title">Sumá puntos en cada compra</p>
                        <p className="perfil-puntos-text">Acumulá puntos y obtené descuentos exclusivos.</p>
                    </div>
                </div>
                <button type="button" className="perfil-puntos-btn" disabled title="Próximamente">
                    🎁 Ver mis puntos
                </button>
            </div>
        </PerfilLayout>
    );
};

export default Perfil;
