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
        : await register(email, password, name, '👤');
      onSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar autenticação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-6 bg-[#0a0a0a]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="size-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
            {mode === 'login' ? 'Área do Mestre' : 'Novo Mestre'}
          </h1>
          <p className="text-slate-500 font-medium">
            {mode === 'login' ? 'Entre para comandar o show' : 'Crie sua conta de apresentador'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Seu nome"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-slate-800/50 border-2 border-transparent focus:border-primary/50 rounded-2xl text-white outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">E-mail Profissional</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="email"
                placeholder="exemplo@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-slate-800/50 border-2 border-transparent focus:border-primary/50 rounded-2xl text-white outline-none transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Senha de Acesso</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-slate-800/50 border-2 border-transparent focus:border-primary/50 rounded-2xl text-white outline-none transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm font-bold text-center bg-red-400/10 py-3 rounded-xl border border-red-400/20"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-primary text-white font-black text-lg rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : (mode === 'login' ? 'Acessar Painel' : 'Criar Conta')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-slate-500 font-bold hover:text-primary transition-colors text-sm"
          >
            {mode === 'login' ? 'Não tem acesso? Solicite aqui' : 'Já possui conta? Faça login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
