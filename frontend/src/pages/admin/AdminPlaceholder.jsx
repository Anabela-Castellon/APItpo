import AdminLayout from '../../components/admin/AdminLayout';

// Página genérica "en construcción" para las secciones admin que todavía no tienen funcionalidad real
const AdminPlaceholder = ({ title }) => (
  <AdminLayout title={title}>
    <div className="admin-card admin-placeholder">
      <p>🚧 Sección en construcción</p>
    </div>
  </AdminLayout>
);

export default AdminPlaceholder;
