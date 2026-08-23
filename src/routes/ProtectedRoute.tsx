import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { getToken } from '@/utils/storage';
import FRONTEND_ROUTES from '@/constants/frontendRoutes';

function ProtectedRoute() {
  const token = getToken();
  const location = useLocation();

  // if (!token) {
  //   return (
  //     <Navigate
  //       to={FRONTEND_ROUTES.AUTH.LOGIN}
  //       replace
  //       state={{
  //         from: location,
  //       }}
  //     />
  //   );
  // }

  return <Outlet />;
}

export default ProtectedRoute;
