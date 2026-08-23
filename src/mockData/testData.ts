import type { SubTopic, Subject, Topic } from '@/types/test';

/* =========================================================
   SUBJECTS
========================================================= */

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 'c495e328-066c-4ae5-a959-4bb9f3e357d7',
    name: 'Maths',
    created_at: '2026-06-03T12:56:24.016+05:30',
    updated_at: '2026-06-03T12:56:24.016+05:30',
  },

  {
    id: 'subject-english',
    name: 'English',
    created_at: '',
    updated_at: '',
  },

  {
    id: 'subject-science',
    name: 'Science',
    created_at: '',
    updated_at: '',
  },

  {
    id: 'subject-general-aptitude',
    name: 'General Aptitude Test',
    created_at: '',
    updated_at: '',
  },
];

/* =========================================================
   TOPICS
========================================================= */

export const MOCK_TOPICS: Topic[] = [
  {
    id: '21a810af-5d94-4f74-8243-642e6fd7f932',
    subject_id: 'c495e328-066c-4ae5-a959-4bb9f3e357d7',
    name: 'Geometry',
    created_at: '2026-06-07T07:42:56.962+05:30',
    updated_at: '2026-06-07T07:42:56.962+05:30',
  },

  {
    id: 'b36316da-4e2c-46d6-ac23-1335cd4c4379',
    subject_id: 'c495e328-066c-4ae5-a959-4bb9f3e357d7',
    name: 'Calculus',
    created_at: '2026-06-07T07:42:54.813+05:30',
    updated_at: '2026-06-07T07:42:54.813+05:30',
  },

  {
    id: 'b7476026-cdd9-40b1-88bb-2041ed7e0b1b',
    subject_id: 'c495e328-066c-4ae5-a959-4bb9f3e357d7',
    name: 'Algebra',
    created_at: '2026-06-07T06:54:55.049+05:30',
    updated_at: '2026-06-07T06:54:55.049+05:30',
  },

  {
    id: 'topic-english-grammar',
    subject_id: 'subject-english',
    name: 'Grammar',
    created_at: '',
    updated_at: '',
  },

  {
    id: 'topic-english-vocabulary',
    subject_id: 'subject-english',
    name: 'Vocabulary',
    created_at: '',
    updated_at: '',
  },

  {
    id: 'topic-english-comprehension',
    subject_id: 'subject-english',
    name: 'Comprehension',
    created_at: '',
    updated_at: '',
  },

  {
    id: 'topic-science-physics',
    subject_id: 'subject-science',
    name: 'Physics',
    created_at: '',
    updated_at: '',
  },

  {
    id: 'topic-science-chemistry',
    subject_id: 'subject-science',
    name: 'Chemistry',
    created_at: '',
    updated_at: '',
  },
];

/* =========================================================
   SUB TOPICS
========================================================= */

export const MOCK_SUB_TOPICS: SubTopic[] = [
  {
    id: '718c4913-9fe4-4a93-803d-66636b3bcf12',
    topic_id: '21a810af-5d94-4f74-8243-642e6fd7f932',
    name: 'Circles',
    created_at: '2026-06-07T07:42:58.299+05:30',
    updated_at: '2026-06-07T07:42:58.299+05:30',
  },

  {
    id: '6711d6a3-b353-4315-9458-d05bf902f6ca',
    topic_id: '21a810af-5d94-4f74-8243-642e6fd7f932',
    name: 'Triangles',
    created_at: '2026-06-07T07:42:57.905+05:30',
    updated_at: '2026-06-07T07:42:57.905+05:30',
  },

  {
    id: 'd178a326-949a-4e45-8ae9-506971994599',
    topic_id: 'b36316da-4e2c-46d6-ac23-1335cd4c4379',
    name: 'Derivatives',
    created_at: '2026-06-07T07:42:56.523+05:30',
    updated_at: '2026-06-07T07:42:56.523+05:30',
  },

  {
    id: 'fccd3dbb-a15b-4f80-9f70-acf51391f3d8',
    topic_id: 'b36316da-4e2c-46d6-ac23-1335cd4c4379',
    name: 'Limits',
    created_at: '2026-06-07T07:42:55.748+05:30',
    updated_at: '2026-06-07T07:42:55.748+05:30',
  },

  {
    id: 'subtopic-grammar-tenses',
    topic_id: 'topic-english-grammar',
    name: 'Tenses',
    created_at: '',
    updated_at: '',
  },

  {
    id: 'subtopic-grammar-sentence',
    topic_id: 'topic-english-grammar',
    name: 'Sentence Structure',
    created_at: '',
    updated_at: '',
  },

  {
    id: 'subtopic-vocabulary-usage',
    topic_id: 'topic-english-vocabulary',
    name: 'Word Usage',
    created_at: '',
    updated_at: '',
  },

  {
    id: 'subtopic-comprehension-reading',
    topic_id: 'topic-english-comprehension',
    name: 'Reading Comprehension',
    created_at: '',
    updated_at: '',
  },

  {
    id: 'subtopic-physics-mechanics',
    topic_id: 'topic-science-physics',
    name: 'Mechanics',
    created_at: '',
    updated_at: '',
  },

  {
    id: 'subtopic-chemistry-organic',
    topic_id: 'topic-science-chemistry',
    name: 'Organic Chemistry',
    created_at: '',
    updated_at: '',
  },
];
