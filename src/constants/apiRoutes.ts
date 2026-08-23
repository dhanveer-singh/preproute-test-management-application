/* =========================================================
   AUTH
========================================================= */

const AUTH = {
  LOGIN: `/auth/login`,
};

/* =========================================================
   SUBJECTS
========================================================= */

const SUBJECTS = {
  GET_ALL: `/subjects`,
};

/* =========================================================
   TOPICS
========================================================= */

const TOPICS = {
  GET_BY_SUBJECT: (subjectId: string) => `/topics/subject/${subjectId}`,
};

/* =========================================================
   SUB-TOPICS
========================================================= */

const SUB_TOPICS = {
  GET_BY_TOPICS: `/sub-topics/multi-topics`,
};

/* =========================================================
   TESTS
========================================================= */

const TESTS = {
  GET_ALL: `/tests`,

  CREATE: `/tests`,

  GET_BY_ID: (id: string) => `/tests/${id}`,

  UPDATE: (id: string) => `/tests/${id}`,

  DELETE: (id: string) => `/tests/${id}`,
};

/* =========================================================
   QUESTIONS
========================================================= */

const QUESTIONS = {
  CREATE_BULK: `/questions/bulk`,

  FETCH_BULK: `/questions/fetchBulk`,
};

/* =========================================================
   API ENDPOINTS
========================================================= */

const APIS = {
  AUTH,
  SUBJECTS,
  TOPICS,
  SUB_TOPICS,
  TESTS,
  QUESTIONS,
};

export default APIS;
