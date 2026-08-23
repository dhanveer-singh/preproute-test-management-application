import APIS from '@/constants/apiRoutes';
import api from '@/services/api';

import type { CreateTestPayload, Test, UpdateTestPayload } from '@/types/test';

/* =========================================================
   TEST RESPONSE
========================================================= */

interface TestResponse {
  status: string;
  message: string;
  data: Test;
}

/* =========================================================
   GET ALL TESTS RESPONSE
========================================================= */

interface TestsResponse {
  status: string;
  message: string;
  data: Test[];
}

/* =========================================================
   GET ALL TESTS
========================================================= */

export const getTests = async (): Promise<Test[]> => {
  const response = await api.get<TestsResponse>(APIS.TESTS.GET_ALL);

  return response.data.data;
};

/* =========================================================
   GET TEST BY ID
========================================================= */

export const getTestById = async (id: string): Promise<Test> => {
  const response = await api.get<TestResponse>(APIS.TESTS.GET_BY_ID(id));

  return response.data.data;
};

/* =========================================================
   CREATE TEST
========================================================= */

export const createTest = async (payload: CreateTestPayload): Promise<Test> => {
  const response = await api.post<TestResponse>(APIS.TESTS.CREATE, payload);

  return response.data.data;
};

/* =========================================================
   UPDATE TEST
========================================================= */

export const updateTest = async (id: string, payload: UpdateTestPayload): Promise<Test> => {
  const response = await api.put<TestResponse>(APIS.TESTS.UPDATE(id), payload);

  return response.data.data;
};

/* =========================================================
   DELETE TEST
========================================================= */

export const deleteTest = async (id: string): Promise<void> => {
  await api.delete(APIS.TESTS.DELETE(id));
};
