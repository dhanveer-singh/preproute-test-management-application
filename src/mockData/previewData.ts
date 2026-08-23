import type { Question } from '@/types/question';
import type { PreviewTestData } from '@/types/preview';

export const MOCK_PREVIEW_TEST: PreviewTestData = {
  id: 'bc8c2e0b-0138-4270-9902-d4b48153da6b',

  name: 'Chapter 1',

  type: 'chapterwise',

  subject: 'Maths',

  topics: ['Geometry'],

  sub_topics: ['Circles'],

  questions: ['question-1', 'question-2', 'question-3'],

  correct_marks: 5,

  unattempt_marks: 0,

  wrong_marks: -1,

  difficulty: 'easy',

  total_marks: 250,

  total_time: 60,

  total_questions: 50,

  slot: null,

  hidden_from_moderator: null,

  created_by: 1,

  created_at: '2026-08-23T17:14:29.684+05:30',

  updated_by: 1,

  updated_at: '2026-08-23T17:57:17.934+05:30',

  paragraph_question: null,

  status: 'draft',

  scheduled_date: null,

  expiry_date: null,

  original_files: [],

  previewQuestions: [
    {
      id: 'question-1',

      type: 'mcq',

      question: 'Which of the following is the correct formula for the area of a circle?',

      option1: '2πr',

      option2: 'πr²',

      option3: 'πd',

      option4: 'r²',

      correct_option: 'option2',

      explanation: 'The area of a circle is calculated using the formula πr².',

      difficulty: 'easy',

      paragraph: null,

      media_url: null,

      created_by: 1,

      created_at: '2026-08-23T17:57:17.721+05:30',

      updated_by: null,

      updated_at: null,

      test_id: 'bc8c2e0b-0138-4270-9902-d4b48153da6b',

      category: null,

      subject: 'Maths',

      topic: 'Geometry',

      sub_topic: 'Circles',
    },

    {
      id: 'question-2',

      type: 'mcq',

      question: 'What is the value of 2 + 2?',

      option1: '3',

      option2: '4',

      option3: '5',

      option4: '6',

      correct_option: 'option2',

      explanation: 'Adding 2 and 2 gives a result of 4.',

      difficulty: 'easy',

      paragraph: null,

      media_url: null,

      created_by: 1,

      created_at: '2026-08-23T17:57:17.721+05:30',

      updated_by: null,

      updated_at: null,

      test_id: 'bc8c2e0b-0138-4270-9902-d4b48153da6b',

      category: null,

      subject: 'Maths',

      topic: 'Geometry',

      sub_topic: 'Circles',
    },

    {
      id: 'question-3',

      type: 'mcq',

      question: 'What is the sum of the angles in a triangle?',

      option1: '90°',

      option2: '180°',

      option3: '270°',

      option4: '360°',

      correct_option: 'option2',

      explanation: 'The sum of the interior angles of a triangle is 180°.',

      difficulty: 'easy',

      paragraph: null,

      media_url: null,

      created_by: 1,

      created_at: '2026-08-23T17:57:17.721+05:30',

      updated_by: null,

      updated_at: null,

      test_id: 'bc8c2e0b-0138-4270-9902-d4b48153da6b',

      category: null,

      subject: 'Maths',

      topic: 'Geometry',

      sub_topic: 'Circles',
    },
  ],
};
