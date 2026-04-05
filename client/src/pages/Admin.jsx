import { ShieldAlert } from 'lucide-react';

const Admin = () => {
  return (
    <div className="admin-page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ShieldAlert size={36} color="#eab308" />
        <h1>Admin Dashboard</h1>
      </div>
      
      <div className="glass-panel" style={{ padding: '3rem', borderRadius: '1rem', textAlign: 'center' }}>
        <ShieldAlert size={64} color="#eab308" style={{ margin: '0 auto 1.5rem', opacity: 0.8 }} />
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Administrator Access Required</h2>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
          This page is restricted to platform administrators. From here, admins can manage magazines, articles, user accounts, and view platform analytics.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ backgroundColor: 'var(--color-bg-main)', padding: '2rem', borderRadius: '0.5rem', minWidth: '200px', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Magazines</h3>
            <p style={{ fontSize: '2rem', fontWeight: '800' }}>142</p>
          </div>
          <div style={{ backgroundColor: 'var(--color-bg-main)', padding: '2rem', borderRadius: '0.5rem', minWidth: '200px', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Users</h3>
            <p style={{ fontSize: '2rem', fontWeight: '800' }}>10,482</p>
          </div>
          <div style={{ backgroundColor: 'var(--color-bg-main)', padding: '2rem', borderRadius: '0.5rem', minWidth: '200px', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Subscriptions</h3>
            <p style={{ fontSize: '2rem', fontWeight: '800' }}>5,231</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
