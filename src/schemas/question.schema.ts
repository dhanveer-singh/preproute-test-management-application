import { z } from 'zod';

export const questionSchema = z.object({
  question: z.string().trim().min(1, 'Question is required'),

  option1: z.string().trim().min(1, 'Option 1 is required'),

  option2: z.string().trim().min(1, 'Option 2 is required'),

  option3: z.string().trim().min(1, 'Option 3 is required'),

  option4: z.string().trim().min(1, 'Option 4 is required'),

  correctOption: z
    .union([
      z.literal('option1'),
      z.literal('option2'),
      z.literal('option3'),
      z.literal('option4'),
      z.literal(''),
    ])
    .refine((value) => value !== '', {
      message: 'Please select the correct option',
    }),

  explanation: z.string(),

  difficulty: z.union([
    z.literal('easy'),
    z.literal('medium'),
    z.literal('difficult'),
    z.literal(''),
  ]),

  topic: z.string(),

  subTopic: z.string(),

  mediaUrl: z.string(),
});

export type QuestionSchemaData = z.infer<typeof questionSchema>;
