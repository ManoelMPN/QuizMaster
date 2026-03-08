import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, Timer, RotateCcw, PartyPopper } from 'lucide-react';
import { Participant } from '../types';

interface LeaderboardScreenProps {
  participants: Participant[];
}

export default function LeaderboardScreen({ participants }: LeaderboardScreenProps) {
  const top3 = [...participants].sort((a, b) => b.points - a.points).slice(0, 3);
  const rest = [...participants].sort((a, b) => b.points - a.points).slice(3, 10);

  // Reorder for podium: 2nd, 1st, 3rd
  const podium = [top3[1], top3[0], top3[2]].filter(p => p !== undefined);

  return (
    <div className="flex-1 flex flex-col items-center py-10 px-4 md:px-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          Placar Final
        </h1>
        <p className="text-slate-400 text-lg">Desempenho incrível de todos! 🎊</p>
      </motion.div>

      <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-4 w-full max-w-4xl mb-16">
        {podium.map((p, idx) => {
          const isFirst = p.id === top3[0]?.id;
          const isSecond = p.id === top3[1]?.id;
          const isThird = p.id === top3[2]?.id;
          const rank = isFirst ? 1 : isSecond ? 2 : 3;
          const borderColor = isFirst ? 'border-yellow-400' : isSecond ? 'border-slate-400' : 'border-orange-700/60';
          const bgColor = isFirst ? 'podium-gradient-1 bg-yellow-400/5' : isSecond ? 'podium-gradient-2' : 'podium-gradient-3';
          const rankBg = isFirst ? 'bg-yellow-400 text-slate-900' : isSecond ? 'bg-slate-400 text-white' : 'bg-orange-700 text-white';

          return (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className={`flex flex-col items-center w-full md:w-1/3 ${isFirst ? '-mt-8 z-10' : 'order-2 md:order-none'}`}
            >
              <div className="relative mb-4">
                {isFirst && (
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-400"
                  >
                    <Trophy size={40} fill="currentColor" />
                  </motion.div>
                )}
                <div className={`rounded-full border-4 ${borderColor} p-1 flex items-center justify-center bg-slate-800 ${isFirst ? 'w-32 h-32 shadow-[0_0_30px_rgba(234,179,8,0.3)]' : isSecond ? 'w-24 h-24' : 'w-20 h-20'}`}>
                  <span className={isFirst ? 'text-6xl' : isSecond ? 'text-5xl' : 'text-4xl'}>
                    {p.name.split(' ')[0]}
                  </span>
                </div>
                <div className={`absolute -bottom-2 -right-2 ${rankBg} rounded-full flex items-center justify-center font-bold shadow-lg ${isFirst ? 'w-12 h-12 text-2xl' : isSecond ? 'w-10 h-10 text-xl' : 'w-8 h-8 text-lg'}`}>
                  {rank}
                </div>
              </div>
              <div className={`${bgColor} w-full pt-8 pb-10 px-4 rounded-t-2xl border-t border-x ${borderColor.split(' ')[0]}/30 text-center`}>
                <p className={`font-bold mb-1 ${isFirst ? 'text-2xl' : isSecond ? 'text-xl' : 'text-lg'}`}>{p.name.split(' ').slice(1).join(' ')}</p>
                <p className={`text-primary font-black ${isFirst ? 'text-xl' : 'text-lg'}`}>{p.points.toLocaleString()} pts</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-3">
        {rest.map((p, idx) => (
          <motion.div 
            key={p.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + idx * 0.1 }}
            className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-white/5 hover:border-primary/50 transition-all shadow-sm group"
          >
            <div className="w-8 font-bold text-slate-500">{idx + 4}.</div>
            <div className="size-12 rounded-full bg-slate-700 flex items-center justify-center text-2xl border-2 border-slate-600 group-hover:border-primary transition-colors">
              {p.name.split(' ')[0]}
            </div>
            <div className="flex flex-col flex-1">
              <p className="font-bold text-white">{p.name.split(' ').slice(1).join(' ')}</p>
              {p.status && <p className="text-xs text-slate-500">{p.status}</p>}
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">{p.points.toLocaleString()} pts</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center gap-6">
        <div className="flex items-center gap-8 text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-primary" />
            <span>{participants.length} Participantes</span>
          </div>
          <div className="flex items-center gap-2">
            <Timer size={20} className="text-primary" />
            <span>Placar em Tempo Real</span>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-10 right-10"
      >
        <div className="bg-slate-800 p-4 rounded-full shadow-2xl border border-white/10 flex items-center gap-3 animate-pulse">
          <PartyPopper size={20} className="text-yellow-400" />
          <span className="text-sm font-bold">Novo recorde!</span>
        </div>
      </motion.div>
    </div>
  );
}
