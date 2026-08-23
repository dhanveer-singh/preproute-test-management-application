import type { Question } from '@/types/question';
import type { Test } from '@/types/test';

export interface PreviewTestData extends Test {
  previewQuestions: Question[];
}
