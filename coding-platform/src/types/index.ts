export interface Challenge {
  id: string;
  title: string;
  description?: string;
  difficulty: string;
  category?: string;
  language?: string;
  instructions?: string;
  points?: number;
  questions?: Question[];
  completionTime?: number;
}

export interface Question {
  id: string;
  title: string;
  description?: string;
  options?: Option[];
  correctAnswer?: string;
  completed?: boolean;
  timeSpent?: number;
}

export interface Option {
  id: string;
  text: string;
}

export interface CompletionState {
  [questionId: string]: {
    completed: boolean;
    timeSpent: number;
    selectedAnswer?: string;
  };
}
