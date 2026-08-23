import APIS from '@/constants/apiRoutes';
import api from '@/services/api';

import type { Subject } from '@/types/test';

/* =========================================================
   GET SUBJECTS RESPONSE
========================================================= */

export interface GetSubjectsResponse {
  status: string;
  message: string;
  data: Subject[];
}

/* =========================================================
   GET ALL SUBJECTS
========================================================= */

export const getSubjects = async (): Promise<Subject[]> => {
  const response = await api.get<GetSubjectsResponse>(APIS.SUBJECTS.GET_ALL);

  return response.data.data;
};
