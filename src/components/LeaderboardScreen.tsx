import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, Timer, RotateCcw, PartyPopper } from 'lucide-react';
import { Participant } from '../types';

interface LeaderboardScreenProps {
  participants: Participant[];
  currentParticipantId?: string | null;
}

export default function LeaderboardScreen({ participants, currentParticipantId }: LeaderboardScreenProps) {
  const sortedParticipants = [...participants].sort((a, b) => b.points - a.points);
  const top3 = sortedParticipants.slice(0, 3);
  const rest = sortedParticipants.slice(3, 10);
  
  const myPosition = currentParticipantId 
    ? sortedParticipants.findIndex(p => p.id === currentParticipantId) + 1 
    : -1;
  const myData = currentParticipantId 
    ? sortedParticipants.find(p => p.id === currentParticipantId) 
    : null;
  const isOutsideTop10 = myPosition > 10;

  // Reorder for podium: 2nd, 1st, 3rd
  const podium = [top3[1], top3[0], top3[2]].filter(p => p !== undefined);

  return (
    <div className="flex-1 flex flex-col items-center py-6 md:py-10 px-2 md:px-20 w-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-8 md:mb-12"
      >
        <h1 className="text-3xl md:text-6xl font-black mb-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          Placar
        </h1>
        <p className="text-slate-400 text-sm md:text-lg">Desempenho incrível! 🎊</p>
      </motion.div>

      <div className="flex flex-row items-end justify-center gap-2 md:gap-4 w-full max-w-4xl mb-10 md:mb-16 scale-90 md:scale-100">
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
              className={`flex flex-col items-center w-1/3 ${isFirst ? '-mt-4 md:-mt-8 z-10' : ''}`}
            >
              <div className="relative mb-2 md:mb-4">
                {isFirst && (
                  <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-6 md:-top-10 left-1/2 -translate-x-1/2 text-yellow-400"
                  >
                    <Trophy size={24} className="md:w-10 md:h-10" fill="currentColor" />
                  </motion.div>
                )}
                <div className={`rounded-full border-2 md:border-4 ${borderColor} p-0.5 md:p-1 flex items-center justify-center bg-slate-800 ${isFirst ? 'w-20 h-20 md:w-32 md:h-32 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : isSecond ? 'w-16 h-16 md:w-24 md:h-24' : 'w-14 h-14 md:w-20 md:h-20'}`}>
                  <span className={isFirst ? 'text-3xl md:text-6xl' : isSecond ? 'text-2xl md:text-5xl' : 'text-xl md:text-4xl'}>
                    {p.name.split(' ')[0]}
                  </span>
                </div>
                <div className={`absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 ${rankBg} rounded-full flex items-center justify-center font-bold shadow-lg ${isFirst ? 'w-8 h-8 md:w-12 md:h-12 text-sm md:text-2xl' : isSecond ? 'w-6 h-6 md:w-10 md:h-10 text-xs md:text-xl' : 'w-5 h-5 md:w-8 md:h-8 text-[10px] md:text-lg'}`}>
                  {rank}
                </div>
              </div>
              <div className={`${bgColor} w-full pt-4 md:pt-8 pb-4 md:pb-10 px-1 md:px-4 rounded-t-xl md:rounded-t-2xl border-t border-x ${borderColor.split(' ')[0]}/30 text-center`}>
                <p className={`font-bold mb-0.5 truncate ${isFirst ? 'text-sm md:text-2xl' : 'text-xs md:text-xl'}`}>{p.name.split(' ').slice(1).join(' ')}</p>
                <p className={`text-primary font-black ${isFirst ? 'text-xs md:text-xl' : 'text-[10px] md:text-lg'}`}>{p.points.toLocaleString()} pts</p>
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
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all shadow-sm group ${p.id === currentParticipantId ? 'bg-primary/10 border-primary shadow-primary/10' : 'bg-slate-800/50 border-white/5 hover:border-primary/50'}`}
          >
            <div className="w-8 font-bold text-slate-500">{idx + 4}.</div>
            <div className="size-12 rounded-full bg-slate-700 flex items-center justify-center text-2xl border-2 border-slate-600 group-hover:border-primary transition-colors">
              {p.name.split(' ')[0]}
            </div>
            <div className="flex flex-col flex-1">
              <p className="font-bold text-white">{p.name.split(' ').slice(1).join(' ')}</p>
              {p.id === currentParticipantId && <p className="text-xs text-primary font-bold uppercase tracking-widest">Você</p>}
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">{p.points.toLocaleString()} pts</p>
            </div>
          </motion.div>
        ))}

        {isOutsideTop10 && myData && (
          <>
            <div className="flex justify-center py-2">
              <div className="h-1 w-1 bg-slate-700 rounded-full mx-1" />
              <div className="h-1 w-1 bg-slate-700 rounded-full mx-1" />
              <div className="h-1 w-1 bg-slate-700 rounded-full mx-1" />
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 bg-primary/10 p-4 rounded-xl border border-primary shadow-lg shadow-primary/10"
            >
              <div className="w-8 font-bold text-primary">{myPosition}.</div>
              <div className="size-12 rounded-full bg-slate-700 flex items-center justify-center text-2xl border-2 border-primary">
                {myData.name.split(' ')[0]}
              </div>
              <div className="flex flex-col flex-1">
                <p className="font-bold text-white">{myData.name.split(' ').slice(1).join(' ')}</p>
                <p className="text-xs text-primary font-bold uppercase tracking-widest">Sua Posição</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{myData.points.toLocaleString()} pts</p>
              </div>
            </motion.div>
          </>
        )}
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
