import { useState, type FormEvent } from 'react';
import { api, getErrorMessage } from '../api/client';
import type { Role, UserRequest } from '../types';

const emptyForm: UserRequest = { email: '', password: '', role: 'STAFF' };

export default function CreateUserPage() {
  const [form, setForm] = useState<UserRequest>(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload: UserRequest = { ...form, email: form.email.trim() };

    setSaving(true);
    try {
      await api.post('/register', payload);
      setSuccess(`User ${payload.email} created with role ${payload.role}.`);
      setForm(emptyForm);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create user'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>Create user</h2>
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <label>
        Email
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </label>

      <label>
        Password (min 8 characters)
        <input
          type={showPassword ? 'text' : 'password'}
          minLength={8}
          maxLength={72}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
      </label>

      <label style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={showPassword}
          onChange={(e) => setShowPassword(e.target.checked)}
        />
        Show password
      </label>

      <label>
        Role
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
        >
          <option value="ADMIN">ADMIN</option>
          <option value="MANAGER">MANAGER</option>
          <option value="STAFF">STAFF</option>
        </select>
      </label>

      <div className="actions">
        <button type="submit" disabled={saving}>
          {saving ? 'Creating...' : 'Create user'}
        </button>
      </div>
    </form>
  );
}