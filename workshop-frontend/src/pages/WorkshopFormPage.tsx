import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client';
import {
  WORKSHOP_STATUSES,
  type Workshop,
  type WorkshopRequest,
  type WorkshopStatus,
} from '../types';

const empty: WorkshopRequest = {
  title: '',
  description: '',
  location: '',
  startDateTime: '',
  endDateTime: '',
  capacity: 10,
  status: 'UPCOMING',
};

// <input type="datetime-local"> wants "YYYY-MM-DDTHH:mm"
const toInput = (v: string) => v.slice(0, 16);

// Current local time in the same "YYYY-MM-DDTHH:mm" format
const nowInput = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

export default function WorkshopFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<WorkshopRequest>(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api
      .get<Workshop>(`/workshops/${id}`)
      .then(({ data }) =>
        setForm({
          title: data.title,
          description: data.description ?? '',
          location: data.location,
          startDateTime: toInput(data.startDateTime),
          endDateTime: toInput(data.endDateTime),
          capacity: data.capacity,
          status: data.status,
        })
      )
      .catch((err) => setError(getErrorMessage(err, 'Failed to load workshop')))
      .finally(() => setLoading(false));
  }, [id]);

  const set = <K extends keyof WorkshopRequest>(key: K, value: WorkshopRequest[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // The backend requires startDateTime to be in the future (@Future)
    if (form.startDateTime <= nowInput()) {
      setError('Start time must be in the future.');
      return;
    }
    if (form.endDateTime <= form.startDateTime) {
      setError('End time must be after start time.');
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/workshops/${id}`, form);
      } else {
        await api.post('/workshops/create', form);
      }
      navigate('/workshops');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to save workshop'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Edit workshop' : 'New workshop'}</h2>
      {error && <div className="alert error">{error}</div>}

      <label>
        Title
        <input
          value={form.title}
          maxLength={150}
          onChange={(e) => set('title', e.target.value)}
          required
        />
      </label>

      <label>
        Description
        <textarea
          rows={3}
          value={form.description}
          maxLength={2000}
          onChange={(e) => set('description', e.target.value)}
        />
      </label>

      <label>
        Location
        <input
          value={form.location}
          maxLength={200}
          onChange={(e) => set('location', e.target.value)}
          required
        />
      </label>

      <div className="row">
        <label>
          Starts
          <input
            type="datetime-local"
            min={nowInput()}
            value={form.startDateTime}
            onChange={(e) => set('startDateTime', e.target.value)}
            required
          />
        </label>
        <label>
          Ends
          <input
            type="datetime-local"
            min={form.startDateTime || nowInput()}
            value={form.endDateTime}
            onChange={(e) => set('endDateTime', e.target.value)}
            required
          />
        </label>
      </div>

      <div className="row">
        <label>
          Capacity
          <input
            type="number"
            min={1}
            value={form.capacity}
            onChange={(e) => set('capacity', Number(e.target.value))}
            required
          />
        </label>
        <label>
          Status
          <select
            value={form.status}
            onChange={(e) => set('status', e.target.value as WorkshopStatus)}
          >
            {WORKSHOP_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="actions">
        <button type="button" className="secondary" onClick={() => navigate('/workshops')}>
          Cancel
        </button>
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save workshop'}
        </button>
      </div>
    </form>
  );
}