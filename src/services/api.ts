import { User, Quiz, Question } from '../types';

export async function login(email: string, password: string): Promise<User> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return (await res.json()).user;
}

export async function register(email: string, password: string, name: string, avatar: string): Promise<User> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, avatar }),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return (await res.json()).user;
}

export async function updateProfile(data: { name: string; password?: string; avatar: string }): Promise<User> {
  const res = await fetch('/api/auth/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return (await res.json()).user;
}

export async function getQuizzes(): Promise<Quiz[]> {
  const res = await fetch('/api/quizzes');
  if (!res.ok) throw new Error('Falha ao carregar quizzes');
  return res.json();
}

export async function createQuiz(title: string): Promise<Quiz> {
  const res = await fetch('/api/quizzes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('Falha ao criar quiz');
  return res.json();
}

export async function deleteQuiz(id: string): Promise<void> {
  await fetch(`/api/quizzes/${id}`, { method: 'DELETE' });
}

export async function getQuestions(quizId: string): Promise<Question[]> {
  const res = await fetch(`/api/questions/${quizId}`);
  if (!res.ok) throw new Error('Falha ao carregar perguntas');
  return res.json();
}

export async function createQuestion(data: Omit<Question, 'id'>): Promise<{ id: string }> {
  const res = await fetch('/api/questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao criar pergunta');
  return res.json();
}

export async function getMe(): Promise<User | null> {
  const res = await fetch('/api/auth/me');
  if (!res.ok) return null;
  return (await res.json()).user;
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' });
}
