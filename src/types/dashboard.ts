export type TestStatus = 'Published' | 'Scheduled' | 'Draft';

export type TestDifficulty = 'Easy' | 'Medium' | 'Difficult';

export interface DashboardTest {
  id: string;
  name: string;
  subject: string;
  topic: string;
  questions: number;
  marks: number;
  duration: number;
  difficulty: TestDifficulty;
  status: TestStatus;
}
