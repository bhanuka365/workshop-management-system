import { Navigate, Route, Routes } from 'react-router-dom';
import { homeFor, useAuth } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import WorkshopsPage from './pages/WorkshopsPage';
import WorkshopFormPage from './pages/WorkshopFormPage';
import CreateUserPage from './pages/CreateUserPage';

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* Manager + Staff */}
          <Route element={<ProtectedRoute roles={['MANAGER', 'STAFF']} />}>
            <Route path="/workshops" element={<WorkshopsPage />} />
          </Route>

          {/* Manager only */}
          <Route element={<ProtectedRoute roles={['MANAGER']} />}>
            <Route path="/workshops/new" element={<WorkshopFormPage />} />
            <Route path="/workshops/:id/edit" element={<WorkshopFormPage />} />
          </Route>

          {/* Admin only */}
          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route path="/users/new" element={<CreateUserPage />} />
          </Route>
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to={user ? homeFor(user.role) : '/login'} replace />}
      />
    </Routes>
  );
}