import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { WORKSHOP_STATUSES, type Workshop } from '../types';

function formatDateTime(value: string) {
  return new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

export default function WorkshopsPage() {
  const { hasRole } = useAuth();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    api
      .get<Workshop[]>('/workshops')
      .then((res) => setWorkshops(res.data))
      .catch((err) => setError(getErrorMessage(err, 'Failed to load workshops')))
      .finally(() => setLoading(false));
  }, []);

  // Client-side filtering for now. Move to query params on the backend as the data grows.
  const filtered = useMemo(() => {
    return workshops.filter((w) => {
      const start = w.startDateTime.slice(0, 10);
      if (from && start < from) return false;
      if (to && start > to) return false;
      if (status && w.status !== status) return false;
      return true;
    });
  }, [workshops, from, to, status]);

  const clearFilters = () => {
    setFrom('');
    setTo('');
    setStatus('');
  };

  return (
    <div>
      <div className="page-head">
        <h2>Workshops</h2>
        {hasRole('MANAGER') && (
          <Link className="btn" to="/workshops/new">
            + New workshop
          </Link>
        )}
      </div>

      <div className="card filters">
        <label>
          From
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label>
          To
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            {WORKSHOP_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="secondary" onClick={clearFilters}>
          Clear
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No workshops match your filters.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Starts</th>
              <th>Ends</th>
              <th>Capacity</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => (
              <tr key={w.id}>
                <td>{w.title}</td>
                <td>{w.location}</td>
                <td>{formatDateTime(w.startDateTime)}</td>
                <td>{formatDateTime(w.endDateTime)}</td>
                <td>{w.capacity}</td>
                <td>
                  <span className={`badge ${w.status.toLowerCase()}`}>{w.status}</span>
                </td>
                <td>
                  {hasRole('MANAGER') && <Link to={`/workshops/${w.id}/edit`}>Edit</Link>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}