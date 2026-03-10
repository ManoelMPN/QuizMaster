export interface Participant {
  id: string;
  name: string;
  points: number;
  avatar: string;
  status?: string;
  joinedAt: number;
  last_points?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Quiz {
  id: string;
  title: string;
  userId: string;
  backgroundUrl?: string;
  createdAt: number;
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  options: string[];
  correctOption: number;
  timeLimit: number; // seconds
  backgroundUrl?: string;
}

export interface GameState {
  currentQuestionId: string | null;
  activeQuizId: string | null;
  status: 'waiting' | 'countdown' | 'question' | 'answer' | 'ranking' | 'finished';
  questionStartTime?: number;
  countdown?: number;
  roomCode?: string;
  totalQuestions?: number;
  currentQuestionIndex?: number;
}

export type Screen = 'home' | 'auth' | 'join' | 'leaderboard' | 'admin' | 'participant';
export type AuthMode = 'login' | 'register';
