import APIS from '@/constants/apiRoutes';
import api from '@/services/api';

import type { SubTopic, Topic } from '@/types/test';

/* =========================================================
   GET TOPICS RESPONSE
========================================================= */

interface GetTopicsResponse {
  status: string;
  message: string;
  data: Topic[];
}

/* =========================================================
   GET SUB-TOPICS RESPONSE
========================================================= */

interface GetSubTopicsResponse {
  status: string;
  message: string;
  data: SubTopic[];
}

/* =========================================================
   GET TOPICS BY SUBJECT
========================================================= */

export const getTopicsBySubject = async (subjectId: string): Promise<Topic[]> => {
  const response = await api.get<GetTopicsResponse>(APIS.TOPICS.GET_BY_SUBJECT(subjectId));

  return response.data.data;
};

/* =========================================================
   GET SUB-TOPICS BY MULTIPLE TOPICS
========================================================= */

export const getSubTopicsByTopics = async (topicIds: string[]): Promise<SubTopic[]> => {
  const response = await api.post<GetSubTopicsResponse>(APIS.SUB_TOPICS.GET_BY_TOPICS, {
    topicIds,
  });

  return response.data.data;
};
