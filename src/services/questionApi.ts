import APIS from '@/constants/apiRoutes';
import api from '@/services/api';

import type { CreateQuestionPayload, FetchBulkQuestionsPayload, Question } from '@/types/question';

interface QuestionsResponse {
  status: string;
  message: string;
  data: Question[];
}

/* =========================================================
   BULK CREATE QUESTIONS
   POST /questions/bulk
========================================================= */

export const createQuestionsBulk = async (
  questions: CreateQuestionPayload[],
): Promise<Question[]> => {
  const response = await api.post<QuestionsResponse>(APIS.QUESTIONS.CREATE_BULK, {
    questions,
  });

  return response.data.data;
};

/* =========================================================
   FETCH QUESTIONS IN BULK
   POST /questions/fetchBulk
========================================================= */

export const fetchBulkQuestions = async (questionIds: string[]): Promise<Question[]> => {
  const payload: FetchBulkQuestionsPayload = {
    question_ids: questionIds,
  };

  const response = await api.post<QuestionsResponse>(APIS.QUESTIONS.FETCH_BULK, payload);

  return response.data.data;
};
