const API = '/api';

const AUTH = {
  LOGIN: `${API}/auth/login`,
};

const TESTS = {
  GET_ALL: `${API}/tests`,
  CREATE: `${API}/tests`,
  GET_BY_ID: (id: string) => `${API}/tests/${id}`,
  UPDATE: (id: string) => `${API}/tests/${id}`,
  DELETE: (id: string) => `${API}/tests/${id}`,
};

const QUESTIONS = {
  GET_ALL: (testId: string) => `${API}/tests/${testId}/questions`,
  CREATE: (testId: string) => `${API}/tests/${testId}/questions`,
  UPDATE: (testId: string, questionId: string) => `${API}/tests/${testId}/questions/${questionId}`,
  DELETE: (testId: string, questionId: string) => `${API}/tests/${testId}/questions/${questionId}`,
};

const APIS = {
  AUTH,
  TESTS,
  QUESTIONS,
};

export default APIS;
