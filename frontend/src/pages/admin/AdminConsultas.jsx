import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchConsultas, actualizarEstadoConsulta } from '../../store/consultasSlice';

const badgeClassPorEstado = {
  PENDIENTE: 'admin-badge-pendiente',
  RESPONDIDA: 'admin-badge-respondida',
  CERRADA: 'admin-badge-cerrada',
};

const AdminConsultas = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.consultas);
  const [estadoFiltro, setEstadoFiltro] = useState('');

  useEffect(() => {
    dispatch(fetchConsultas());
  }, [dispatch]);

  const consultasFiltradas = useMemo(() => {
    if (!estadoFiltro) return items;
    return items.filter((c) => c.estado === estadoFiltro);
  }, [items, estadoFiltro]);

  const handleEstadoChange = (consulta, estado) => {
    dispatch(actualizarEstadoConsulta({ id: consulta.id, estado }));
  };

  const handleResponder = (consulta) => {
    const asunto = encodeURIComponent(`Re: ${consulta.asunto || 'Tu consulta a La Esquina'}`);
    const cuerpo = encodeURIComponent(`Hola ${consulta.nombre},\n\nEn relación a tu consulta:\n"${consulta.mensaje}"\n\n`);
    window.location.href = `mailto:${consulta.email}?subject=${asunto}&body=${cuerpo}`;
    if (consulta.estado === 'PENDIENTE') {
      handleEstadoChange(consulta, 'RESPONDIDA');
    }
  };

  return (
    <AdminLayout title="Consultas">
      <div className="admin-page-header">
        <div>
          <h2>Consultas</h2>
          <p className="admin-page-subtitle">{items.length} mensajes recibidos desde el formulario de contacto</p>
        </div>
      </div>

      <div className="admin-card admin-filters-bar">
        <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)} className="admin-input">
          <option value="">Todos los estados</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="RESPONDIDA">Respondida</option>
          <option value="CERRADA">Cerrada</option>
        </select>
      </div>

      <div className="admin-card">
        {loading ? (
          <p className="admin-empty">Cargando consultas...</p>
        ) : consultasFiltradas.length === 0 ? (
          <p className="admin-empty">No hay consultas para mostrar.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Asunto</th>
                <th>Mensaje</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {consultasFiltradas.map((consulta) => (
                <tr key={consulta.id}>
                  <td>{new Date(consulta.fechaEnvio).toLocaleString('es-AR')}</td>
                  <td>{consulta.nombre}</td>
                  <td>{consulta.email}</td>
                  <td>{consulta.asunto || '—'}</td>
                  <td className="admin-consulta-mensaje" title={consulta.mensaje}>{consulta.mensaje}</td>
                  <td>
                    <span className={`admin-badge ${badgeClassPorEstado[consulta.estado]}`}>
                      {consulta.estado}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button className="admin-btn-icon" onClick={() => handleResponder(consulta)} title="Responder por email">✉️</button>
                      <select
                        className="admin-estado-select"
                        value={consulta.estado}
                        onChange={(e) => handleEstadoChange(consulta, e.target.value)}
                      >
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="RESPONDIDA">Respondida</option>
                        <option value="CERRADA">Cerrada</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminConsultas;
