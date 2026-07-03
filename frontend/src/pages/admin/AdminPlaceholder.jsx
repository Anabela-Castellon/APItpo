import AdminLayout from '../../components/admin/AdminLayout';

const AdminPlaceholder = ({ title }) => (
  <AdminLayout title={title}>
    <div className="admin-card admin-placeholder">
      <p>🚧 Sección en construcción</p>
    </div>
  </AdminLayout>
);

export default AdminPlaceholder;
