import { z } from 'zod';

export const testFormSchema = z.object({
  name: z.string().trim().min(1, 'Test name is required'),

  subject: z.string().min(1, 'Subject is required'),

  type: z.string().min(1, 'Test type is required'),

  topics: z.array(z.string()).min(1, 'Select at least one topic'),

  subTopics: z.array(z.string()),

  difficulty: z.string().min(1, 'Difficulty is required'),

  correctMarks: z.coerce.number(),

  wrongMarks: z.coerce.number(),

  unattemptMarks: z.coerce.number(),

  totalTime: z.coerce.number().positive('Duration must be greater than 0'),

  totalMarks: z.coerce.number().positive('Total marks must be greater than 0'),

  totalQuestions: z.coerce.number().positive('Number of questions must be greater than 0'),
});

/*
 * Input type:
 * What React Hook Form receives from inputs.
 */
export type TestFormInput = z.input<typeof testFormSchema>;

/*
 * Output type:
 * What we get after Zod validation/transformation.
 */
export type TestFormData = z.output<typeof testFormSchema>;
