import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { login, register } from '../services/api';
import { User, AuthMode } from '../types';

interface AuthProps {
  onSuccess: (user: User) => void;
}

export default function Auth({ onSuccess }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = mode === 'login' 
        ? await login(email, password) 
        : await register(email, password, name);
      onSuccess(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/50 p-8 rounded-3xl border border-white/10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">
            {mode === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta'}
          </h1>
          <p className="text-slate-400">
            {mode === 'login' ? 'Entre para gerenciar seus quizzes' : 'Comece a criar quizzes incríveis'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="text"
                placeholder="Seu nome"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-slate-800 border-2 border-transparent focus:border-primary rounded-xl text-white outline-none transition-all"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="email"
              placeholder="E-mail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 pl-12 pr-4 bg-slate-800 border-2 border-transparent focus:border-primary rounded-xl text-white outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="password"
              placeholder="Senha"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 pl-12 pr-4 bg-slate-800 border-2 border-transparent focus:border-primary rounded-xl text-white outline-none transition-all"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : (mode === 'login' ? 'Entrar' : 'Cadastrar')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-primary font-semibold hover:underline"
          >
            {mode === 'login' ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre aqui'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
