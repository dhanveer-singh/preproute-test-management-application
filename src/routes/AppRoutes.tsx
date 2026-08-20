import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';

import TestFormPage from '@/pages/tests/TestFormPage';
import QuestionsPage from '@/pages/tests/QuestionsPage';
import PreviewPage from '@/pages/tests/PreviewPage';

function RootRedirect() {
  const token = localStorage.getItem('token');

  return <Navigate to={token ? '/dashboard' : '/login'} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* ================= PROTECTED ROUTES ================= */}

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/tests">
          <Route path="new" element={<TestFormPage />} />
          <Route path=":id/edit" element={<TestFormPage />} />
          <Route path=":id/questions" element={<QuestionsPage />} />
          <Route path=":id/preview" element={<PreviewPage />} />
        </Route>
      </Route>

      {/* ================= ROOT ================= */}

      <Route path="/" element={<RootRedirect />} />

      {/* ================= FALLBACK ================= */}

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

export default AppRoutes;
