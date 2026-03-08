import { User, Quiz, Question } from '../types';

async function handleResponse(res: Response) {
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro na requisição');
    return data;
  } else {
    const text = await res.text();
    if (!res.ok) {
      // If it's a 404 or other error with HTML body, give a cleaner message
      if (res.status === 404) throw new Error('Servidor não encontrado (404). Verifique se o backend está rodando.');
      throw new Error(`Erro do servidor (${res.status}): ${text.slice(0, 100)}...`);
    }
    return text;
  }
}

export async function login(email: string, password: string): Promise<User> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(res);
  return data.user;
}

export async function register(email: string, password: string, name: string, avatar: string): Promise<User> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, avatar }),
  });
  const data = await handleResponse(res);
  return data.user;
}

export async function updateProfile(data: { name: string; password?: string; avatar: string }): Promise<User> {
  const res = await fetch('/api/auth/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const response = await handleResponse(res);
  return response.user;
}

export async function getQuizzes(): Promise<Quiz[]> {
  const res = await fetch('/api/quizzes');
  return handleResponse(res);
}

export async function createQuiz(title: string): Promise<Quiz> {
  const res = await fetch('/api/quizzes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  return handleResponse(res);
}

export async function deleteQuiz(id: string): Promise<void> {
  const res = await fetch(`/api/quizzes/${id}`, { method: 'DELETE' });
  await handleResponse(res);
}

export async function getQuestions(quizId: string): Promise<Question[]> {
  const res = await fetch(`/api/questions/${quizId}`);
  return handleResponse(res);
}

export async function createQuestion(data: Omit<Question, 'id'>): Promise<{ id: string }> {
  const res = await fetch('/api/questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function getMe(): Promise<User | null> {
  try {
    const res = await fetch('/api/auth/me');
    if (!res.ok) return null;
    const data = await handleResponse(res);
    return data.user;
  } catch (err) {
    return null;
  }
}

export async function logout(): Promise<void> {
  const res = await fetch('/api/auth/logout', { method: 'POST' });
  await handleResponse(res);
}
