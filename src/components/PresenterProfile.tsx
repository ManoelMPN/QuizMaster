import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Save, Camera, Key } from 'lucide-react';
import { User as UserType } from '../types';
import { updateProfile } from '../services/api';

interface PresenterProfileProps {
  user: UserType;
  onUpdate: (user: UserType) => void;
}

export default function PresenterProfile({ user, onUpdate }: PresenterProfileProps) {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar || '👤');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const avatars = ['👤', '👨‍🏫', '👩‍🏫', '🧙‍♂️', '🦸‍♂️', '🦸‍♀️', '🤖', '🦊', '🦁', '🐯'];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const updatedUser = await updateProfile({ name, avatar, password: password || undefined });
      onUpdate(updatedUser);
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao atualizar perfil' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 p-8 rounded-3xl border border-white/10 max-w-2xl mx-auto w-full"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="size-16 bg-primary/20 rounded-2xl flex items-center justify-center text-4xl">
          {avatar}
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Editar Perfil</h2>
          <p className="text-slate-400">Gerencie suas informações de apresentador</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="text-sm font-bold text-slate-400 mb-2 block flex items-center gap-2">
            <Camera size={16} /> Escolha seu Avatar
          </label>
          <div className="flex flex-wrap gap-3">
            {avatars.map(a => (
              <button
                key={a}
                type="button"
                onClick={() => setAvatar(a)}
                className={`size-12 rounded-xl text-2xl flex items-center justify-center transition-all ${avatar === a ? 'bg-primary scale-110 shadow-lg shadow-primary/20' : 'bg-slate-800 hover:bg-slate-700'}`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-400 mb-2 block flex items-center gap-2">
            <User size={16} /> Nome de Exibição
          </label>
          <input 
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-4 bg-slate-800 border border-white/10 rounded-xl text-white outline-none focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-400 mb-2 block flex items-center gap-2">
            <Key size={16} /> Nova Senha (deixe em branco para manter a atual)
          </label>
          <input 
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full p-4 bg-slate-800 border border-white/10 rounded-xl text-white outline-none focus:border-primary"
          />
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-primary text-white font-black rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : <><Save size={20} /> Salvar Alterações</>}
        </button>
      </form>
    </motion.div>
  );
}
