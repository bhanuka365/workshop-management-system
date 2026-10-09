import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Layout() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <header className="navbar">
        <strong>Workshop Registration</strong>
        <nav>
          {hasRole('MANAGER', 'STAFF') && <NavLink to="/workshops">Workshops</NavLink>}
          {hasRole('MANAGER') && <NavLink to="/workshops/new">New workshop</NavLink>}
          {hasRole('ADMIN') && <NavLink to="/users/new">Create user</NavLink>}
        </nav>
        <div className="navbar-right">
          <span>
            {user?.email} ({user?.role})
          </span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}