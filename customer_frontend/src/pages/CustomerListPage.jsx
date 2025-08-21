import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiListCustomers, apiDeleteCustomer } from '../api';

// PUBLIC_INTERFACE
export default function CustomerListPage() {
  /** Displays list of customers with add/edit/delete actions. */
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const navigate = useNavigate();

  const load = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiListCustomers();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    setError('');
    setSuccess('');
    try {
      await apiDeleteCustomer(id);
      setSuccess('Customer deleted.');
      setItems(prev => prev.filter(x => x.id !== id));
    } catch (err) {
      setError(err?.message || 'Delete failed');
      if (err?.status === 403 || err?.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <div className="card">
      <div className="toolbar">
        <h2 style={{ margin: 0 }}>Customers</h2>
        <Link to="/customers/new" className="btn">Add customer</Link>
      </div>

      {error && <div className="error" style={{ marginBottom: 8 }}>{error}</div>}
      {success && <div className="success" style={{ marginBottom: 8 }}>{success}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 64 }}>ID</th>
                <th>First name</th>
                <th>Last name</th>
                <th>Email</th>
                <th>Phone</th>
                <th style={{ width: 160 }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.first_name}</td>
                  <td>{c.last_name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link className="btn ghost" to={`/customers/${c.id}`}>Edit</Link>
                      <button className="btn ghost" onClick={() => onDelete(c.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#555' }}>
                    No customers yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
