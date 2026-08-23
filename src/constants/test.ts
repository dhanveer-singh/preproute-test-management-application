export const TEST_TYPES = {
  CHAPTERWISE: 'chapterwise',
  TOPICWISE: 'topicwise',
  PYQ: 'pyq',
  MOCK: 'mock',
} as const;

export const TEST_DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  DIFFICULT: 'difficult',
} as const;

export const TEST_TYPE_LABELS = {
  [TEST_TYPES.CHAPTERWISE]: 'Chapterwise',
  [TEST_TYPES.TOPICWISE]: 'Topic Wise',
  [TEST_TYPES.PYQ]: 'PYQ',
  [TEST_TYPES.MOCK]: 'Mock Test',
} as const;

export const TEST_DIFFICULTY_LABELS = {
  [TEST_DIFFICULTIES.EASY]: 'Easy',
  [TEST_DIFFICULTIES.MEDIUM]: 'Medium',
  [TEST_DIFFICULTIES.DIFFICULT]: 'Difficult',
} as const;

export const TEST_TYPE_OPTIONS = [
  {
    value: TEST_TYPES.CHAPTERWISE,
    label: TEST_TYPE_LABELS[TEST_TYPES.CHAPTERWISE],
  },
  {
    value: TEST_TYPES.TOPICWISE,
    label: TEST_TYPE_LABELS[TEST_TYPES.TOPICWISE],
  },
  {
    value: TEST_TYPES.MOCK,
    label: TEST_TYPE_LABELS[TEST_TYPES.MOCK],
  },
  {
    value: TEST_TYPES.PYQ,
    label: TEST_TYPE_LABELS[TEST_TYPES.PYQ],
  },
] as const;

export const DIFFICULTY_OPTIONS = [
  {
    value: TEST_DIFFICULTIES.EASY,
    label: TEST_DIFFICULTY_LABELS[TEST_DIFFICULTIES.EASY],
  },
  {
    value: TEST_DIFFICULTIES.MEDIUM,
    label: TEST_DIFFICULTY_LABELS[TEST_DIFFICULTIES.MEDIUM],
  },
  {
    value: TEST_DIFFICULTIES.DIFFICULT,
    label: TEST_DIFFICULTY_LABELS[TEST_DIFFICULTIES.DIFFICULT],
  },
] as const;
