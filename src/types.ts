export interface Participant {
  id: string;
  name: string;
  points: number;
  avatar: string;
  status?: string;
  joinedAt: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
  timeLimit: number; // seconds
}

export interface GameState {
  currentQuestionId: string | null;
  status: 'waiting' | 'countdown' | 'question' | 'ranking' | 'finished';
  questionStartTime?: number;
  countdown?: number;
}

export type Screen = 'auth' | 'join' | 'leaderboard' | 'admin' | 'participant';
export type AuthMode = 'login' | 'register';
