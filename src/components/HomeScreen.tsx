import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Cloud, Users, Trophy } from 'lucide-react';
import { Screen } from '../types';

interface HomeScreenProps {
  onSelect: (screen: Screen) => void;
  isAdmin: boolean;
}

export default function HomeScreen({ onSelect, isAdmin }: HomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-12 max-w-5xl mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
          O que vamos <span className="text-primary">fazer hoje?</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
          Escolha uma das ferramentas interativas para começar sua apresentação.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Quiz Option */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(isAdmin ? 'admin' : 'auth')}
          className="group relative p-8 rounded-3xl bg-slate-900/50 border border-white/10 hover:border-primary/50 transition-all text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy size={120} className="text-primary" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="size-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
              <LayoutDashboard size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">Quiz Interativo</h2>
              <p className="text-slate-400 mt-2">Crie, edite e apresente quizzes em tempo real com placar ao vivo.</p>
            </div>
            <div className="pt-4 flex items-center gap-2 text-primary font-bold">
              <span>Começar agora</span>
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
            </div>
          </div>
        </motion.button>

        {/* Word Cloud Option (Placeholder) */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => alert('Nuvem de Palavras em breve!')}
          className="group relative p-8 rounded-3xl bg-slate-900/50 border border-white/10 hover:border-emerald-500/50 transition-all text-left overflow-hidden opacity-60"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Cloud size={120} className="text-emerald-500" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="size-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
              <Cloud size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">Nuvem de Palavras</h2>
              <p className="text-slate-400 mt-2">Colete opiniões e visualize as palavras mais frequentes em tempo real.</p>
            </div>
            <div className="pt-4 flex items-center gap-2 text-emerald-500 font-bold">
              <span>Em breve</span>
            </div>
          </div>
        </motion.button>
      </div>

      <div className="flex flex-wrap justify-center gap-8 pt-8">
        <div className="flex items-center gap-3 text-slate-500">
          <Users size={20} className="text-primary" />
          <span className="font-bold">Multiplayer Real-time</span>
        </div>
        <div className="flex items-center gap-3 text-slate-500">
          <Trophy size={20} className="text-yellow-400" />
          <span className="font-bold">Placar Dinâmico</span>
        </div>
      </div>
    </div>
  );
}
