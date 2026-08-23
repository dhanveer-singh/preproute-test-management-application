import { Navigate, Route, Routes } from 'react-router-dom';

import FRONTEND_ROUTES from '@/constants/frontendRoutes';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import LoginPage from '@/pages/auth/LoginPage';
import PreviewPage from '@/pages/tests/PreviewPage';
import TestFormPage from '@/pages/tests/TestFormPage';
import { getToken } from '@/utils/storage';

import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import AppLayout from '@/layout/AppLayout';
import QuestionsPage from '@/pages/tests/QuestionsPage';

function RootRedirect() {
  const token = getToken();

  return <Navigate to={token ? FRONTEND_ROUTES.DASHBOARD : FRONTEND_ROUTES.AUTH.LOGIN} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}

      <Route element={<PublicRoute />}>
        <Route path={FRONTEND_ROUTES.AUTH.LOGIN} element={<LoginPage />} />
      </Route>

      {/* ================= PROTECTED ROUTES ================= */}

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={FRONTEND_ROUTES.DASHBOARD} element={<DashboardPage />} />

          <Route path={FRONTEND_ROUTES.TESTS.ROOT}>
            <Route path="new" element={<TestFormPage />} />
            <Route path=":id/edit" element={<TestFormPage />} />
            <Route path=":id/questions" element={<QuestionsPage />} />
            <Route path=":id/preview" element={<PreviewPage />} />
          </Route>
        </Route>
      </Route>

      {/* ================= ROOT ================= */}

      <Route path={FRONTEND_ROUTES.ROOT_PATH} element={<RootRedirect />} />

      {/* ================= FALLBACK ================= */}

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

export default AppRoutes;
