export type QuestionType = 'mcq';

export type QuestionDifficulty = 'easy' | 'medium' | 'difficult';

export type CorrectOption = 'option1' | 'option2' | 'option3' | 'option4';

export interface Question {
  id: string;
  type: QuestionType;

  question: string;

  option1: string;
  option2: string;
  option3: string;
  option4: string;

  correct_option: CorrectOption;

  explanation: string | null;
  difficulty: QuestionDifficulty | null;

  paragraph: string | null;
  media_url: string | null;

  created_by: number;
  created_at: string;

  updated_by: number | null;
  updated_at: string | null;

  test_id: string;

  category: string | null;
  subject: string;

  topic: string | null;
  sub_topic: string | null;
}

/**
 * React Hook Form data.
 */
export interface QuestionFormData {
  question: string;

  option1: string;
  option2: string;
  option3: string;
  option4: string;

  correctOption: CorrectOption | '';

  explanation: string;

  difficulty: QuestionDifficulty | '';

  topic: string;
  subTopic: string;

  mediaUrl: string;
}

/**
 * Data displayed in the Added Questions UI.
 */
export interface QuestionListItem {
  id: string;

  question: string;

  option1: string;
  option2: string;
  option3: string;
  option4: string;

  correctOption: CorrectOption;
}

/**
 * POST /questions/bulk
 */
export interface CreateQuestionPayload {
  type: QuestionType;

  question: string;

  option1: string;
  option2: string;
  option3: string;
  option4: string;

  correct_option: CorrectOption;

  explanation?: string;
  difficulty?: QuestionDifficulty;

  subject: string;

  topic?: string;
  sub_topic?: string;

  media_url?: string;

  test_id: string;
}

export interface BulkCreateQuestionsPayload {
  questions: CreateQuestionPayload[];
}

/**
 * POST /questions/fetchBulk
 */
export interface FetchBulkQuestionsPayload {
  question_ids: string[];
}
