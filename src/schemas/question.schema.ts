import { z } from 'zod';

export const questionSchema = z.object({
  question: z.string().trim().min(1, 'Question is required'),

  option1: z.string().trim().min(1, 'Option 1 is required'),

  option2: z.string().trim().min(1, 'Option 2 is required'),

  option3: z.string().trim().min(1, 'Option 3 is required'),

  option4: z.string().trim().min(1, 'Option 4 is required'),

  correctOption: z.enum(['option1', 'option2', 'option3', 'option4']),

  explanation: z.string().optional(),

  difficulty: z.enum(['easy', 'medium', 'difficult']),

  topic: z.string().optional(),

  subTopic: z.string().optional(),

  mediaUrl: z.string().optional().or(z.literal('')),
});

export type QuestionFormData = z.infer<typeof questionSchema>;
