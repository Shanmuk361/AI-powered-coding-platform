export interface Question {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  testCases: string[];
  expectedOutputs: string[];
}

export interface TestConfig {
  topic: string;
  difficulty: string;
  questionCount: number;
}