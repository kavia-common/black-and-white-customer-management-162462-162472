import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiCreateCustomer, apiGetCustomer, apiUpdateCustomer } from '../api';

// PUBLIC_INTERFACE
export default function CustomerFormPage() {
  /** Add/Edit customer form. If :id exists => edit mode. */
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [values, setValues] = React.useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = React.useState(isEdit);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!isEdit) return;
    let mounted = true;
    (async () => {
      try {
        const data = await apiGetCustomer(id);
        if (mounted) {
          setValues({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || ''
          });
        }
      } catch (err) {
        setError(err?.message || 'Failed to load customer');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id, isEdit]);

  const updateField = (key) => (e) => {
    const v = e.target.value;
    setValues(prev => ({ ...prev, [key]: v }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        email: values.email.trim(),
        phone: values.phone?.trim() || '',
        address: values.address?.trim() || ''
      };
      if (!payload.first_name || !payload.last_name || !payload.email) {
        setError('First name, last name and email are required.');
        setSaving(false);
        return;
      }
      if (isEdit) {
        await apiUpdateCustomer(id, payload);
      } else {
        await apiCreateCustomer(payload);
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError(err?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <div className="toolbar">
        <h2 style={{ margin: 0 }}>{isEdit ? 'Edit customer' : 'Add customer'}</h2>
        <button className="btn ghost" onClick={() => navigate(-1)}>Back</button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <div className="form-col">
              <div className="field">
                <label className="label">First name</label>
                <input className="input" value={values.first_name} onChange={updateField('first_name')} required />
              </div>
            </div>
            <div className="form-col">
              <div className="field">
                <label className="label">Last name</label>
                <input className="input" value={values.last_name} onChange={updateField('last_name')} required />
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Email</label>
            <input className="input" type="email" value={values.email} onChange={updateField('email')} required />
          </div>

          <div className="field">
            <label className="label">Phone</label>
            <input className="input" value={values.phone} onChange={updateField('phone')} />
          </div>

          <div className="field">
            <label className="label">Address</label>
            <textarea className="textarea" rows={3} value={values.address} onChange={updateField('address')} />
          </div>

          {error && <div className="error" style={{ marginBottom: 8 }}>{error}</div>}

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            <button className="btn ghost" type="button" onClick={() => navigate(-1)} disabled={saving}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
