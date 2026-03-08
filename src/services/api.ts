import { User, AuthMode } from '../types';

export async function login(email: string, password: string): Promise<User> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return (await res.json()).user;
}

export async function register(email: string, password: string, name: string): Promise<User> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return (await res.json()).user;
}

export async function getMe(): Promise<User | null> {
  const res = await fetch('/api/auth/me');
  if (!res.ok) return null;
  return (await res.json()).user;
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' });
}
