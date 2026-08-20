import { Navigate, Outlet, useLocation } from 'react-router-dom';

function PublicRoute() {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (token) {
    const from = location.state?.from?.pathname || '/dashboard';

    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
