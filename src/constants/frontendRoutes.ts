const ROOT_PATH = '/';

const AUTH = {
  LOGIN: '/login',
};

const DASHBOARD = '/dashboard';

const TESTS = {
  ROOT: '/tests',
  NEW: '/tests/new',
  EDIT: (id: string) => `/tests/${id}/edit`,
  QUESTIONS: (id: string) => `/tests/${id}/questions`,
  PREVIEW: (id: string) => `/tests/${id}/preview`,
};

const FRONTEND_ROUTES = {
  ROOT_PATH,
  AUTH,
  DASHBOARD,
  TESTS,
};

export default FRONTEND_ROUTES;