import type { QuestionDifficulty, QuestionType } from '@/types/question';

export const QUESTION_TYPE_OPTIONS: {
  value: QuestionType;
  label: string;
}[] = [
  {
    value: 'mcq',
    label: 'MCQ',
  },
];

export const QUESTION_DIFFICULTY_OPTIONS: {
  value: QuestionDifficulty;
  label: string;
}[] = [
  {
    value: 'easy',
    label: 'Easy',
  },
  {
    value: 'medium',
    label: 'Medium',
  },
  {
    value: 'difficult',
    label: 'Difficult',
  },
];
