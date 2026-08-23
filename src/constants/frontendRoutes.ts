const ROOT_PATH = '/';

const DASHBOARD = `${ROOT_PATH}dashboard`;

const TESTS_ROOT = `${ROOT_PATH}tests`;

const TESTS = {
  ROOT: TESTS_ROOT,

  NEW: `${TESTS_ROOT}/new`,

  EDIT: (id: string) => `${TESTS_ROOT}/${id}/edit`,

  QUESTIONS: (id: string) => `${TESTS_ROOT}/${id}/questions`,

  PREVIEW: (id: string) => `${TESTS_ROOT}/${id}/preview`,
};

const AUTH = {
  LOGIN: `${ROOT_PATH}login`,
};

const FRONTEND_ROUTES = {
  ROOT_PATH,
  DASHBOARD,
  AUTH,
  TESTS,
};

export default FRONTEND_ROUTES;
