import { getToken } from '@/utils/storage';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function PublicRoute() {
  const token = getToken();
  const location = useLocation();

  if (token) {
    const from = location.state?.from?.pathname || '/dashboard';

    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
