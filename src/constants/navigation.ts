import { FileSearchCorner, LayoutDashboard, SquarePen } from 'lucide-react';

import FRONTEND_ROUTES from '@/constants/frontendRoutes';

export interface NavigationItem {
  label: string;

  icon: typeof LayoutDashboard;

  route?: string;

  disabled?: boolean;

  match?: (pathname: string) => boolean;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: 'Dashboard',

    icon: LayoutDashboard,

    route: FRONTEND_ROUTES.DASHBOARD,

    match: (pathname) => pathname === FRONTEND_ROUTES.DASHBOARD,
  },

  {
    label: 'Test Creation',

    icon: SquarePen,

    route: FRONTEND_ROUTES.TESTS.NEW,

    match: (pathname) => pathname.startsWith(FRONTEND_ROUTES.TESTS.ROOT),
  },

  {
    label: 'Test Tracking',

    icon: FileSearchCorner,

    disabled: true,
  },
];
