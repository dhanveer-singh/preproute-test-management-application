/* =========================================================
   SUBJECT
========================================================= */

export interface Subject {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

/* =========================================================
   TOPIC
========================================================= */

export interface Topic {
  id: string;
  subject_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

/* =========================================================
   SUB TOPIC
========================================================= */

export interface SubTopic {
  id: string;
  topic_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

/* =========================================================
   TEST
========================================================= */

export interface Test {
  id: string;
  name: string;
  type: string;

  subject: string;

  topics: string[];
  sub_topics: string[];
  questions: string[];

  correct_marks: number;
  unattempt_marks: number;
  wrong_marks: number;

  difficulty: string;

  total_marks: number;
  total_time: number;
  total_questions: number;

  slot: string | null;
  hidden_from_moderator: boolean | null;

  created_by: number;
  created_at: string;

  updated_by: number | null;
  updated_at: string;

  paragraph_question: boolean | null;

  status: string;

  scheduled_date: string | null;
  expiry_date: string | null;

  original_files: unknown[];
}

/* =========================================================
   TEST FORM TYPES
========================================================= */

export interface TestFormValues {
  name: string;
  subject: string;
  type: string;

  topics: string[];
  subTopics: string[];

  difficulty: string;

  correctMarks: number;
  wrongMarks: number;
  unattemptMarks: number;

  totalTime: number;
  totalMarks: number;
  totalQuestions: number;
}

/* =========================================================
   CREATE TEST PAYLOAD
========================================================= */

export interface CreateTestPayload {
  name: string;
  type: string;
  subject: string;

  topics: string[];
  sub_topics: string[];

  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;

  difficulty: string;

  total_time: number;
  total_marks: number;
  total_questions: number;

  status?: string | null;
}

/* =========================================================
   UPDATE TEST PAYLOAD
========================================================= */

export interface UpdateTestPayload {
  name?: string;

  questions?: string[];

  total_questions?: number;

  total_marks?: number;

  status?: string;
}
