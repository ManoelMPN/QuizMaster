import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { Trophy, Users, Timer, RotateCcw, PartyPopper, Crown, Star } from 'lucide-react';
import { Participant } from '../types';

interface LeaderboardScreenProps {
  participants: Participant[];
  currentParticipantId?: string | null;
}

export default function LeaderboardScreen({ participants, currentParticipantId }: LeaderboardScreenProps) {
  const [showPodium, setShowPodium] = useState(false);
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

  useEffect(() => {
    const timer = setTimeout(() => setShowPodium(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center py-6 md:py-10 px-4 md:px-20 w-full overflow-x-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-6 md:mb-12"
      >
        <h1 className="text-2xl md:text-6xl font-black mb-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          Placar do Quiz
        </h1>
        <p className="text-slate-400 text-xs md:text-lg">A competição está pegando fogo! 🔥</p>
      </motion.div>

      {/* Podium Section */}
      <div className="flex flex-row items-end justify-center gap-1 md:gap-4 w-full max-w-4xl mb-8 md:mb-16 scale-[0.85] sm:scale-90 md:scale-100 min-h-[250px] md:min-h-[300px]">
        <AnimatePresence>
          {showPodium && podium.map((p, idx) => {
            const isFirst = p.id === top3[0]?.id;
            const isSecond = p.id === top3[1]?.id;
            const isThird = p.id === top3[2]?.id;
            const rank = isFirst ? 1 : isSecond ? 2 : 3;
            const borderColor = isFirst ? 'border-yellow-400' : isSecond ? 'border-slate-400' : 'border-orange-700/60';
            const rankBg = isFirst ? 'bg-yellow-400 text-slate-900' : isSecond ? 'bg-slate-400 text-white' : 'bg-orange-700 text-white';

            return (
              <motion.div 
                key={p.id}
                layoutId={`podium-${p.id}`}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 100,
                  damping: 15,
                  delay: idx * 0.2 
                }}
                className={`flex flex-col items-center w-1/3 ${isFirst ? '-mt-4 md:-mt-8 z-10' : ''}`}
              >
                <div className="relative mb-2 md:mb-4">
                  {isFirst && (
                    <motion.div 
                      animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="absolute -top-10 md:-top-14 left-1/2 -translate-x-1/2 text-yellow-400"
                    >
                      <Crown size={32} className="md:w-12 md:h-12 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" fill="currentColor" />
                    </motion.div>
                  )}
                  <div className={`relative z-10 rounded-full border-2 md:border-4 ${borderColor} p-0.5 md:p-1 flex items-center justify-center bg-slate-800 ${isFirst ? 'w-24 h-24 md:w-40 md:h-40 shadow-[0_0_30px_rgba(234,179,8,0.3)]' : isSecond ? 'w-20 h-20 md:w-32 md:h-32' : 'w-16 h-16 md:w-28 md:h-28'}`}>
                    <span className={isFirst ? 'text-4xl md:text-7xl' : isSecond ? 'text-3xl md:text-6xl' : 'text-2xl md:text-5xl'}>
                      {p.avatar}
                    </span>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 z-20 ${rankBg} rounded-full flex items-center justify-center font-black shadow-lg ${isFirst ? 'w-10 h-10 md:w-14 md:h-14 text-sm md:text-2xl' : isSecond ? 'w-8 h-8 md:w-12 md:h-12 text-xs md:text-xl' : 'w-7 h-7 md:w-10 md:h-10 text-[10px] md:text-lg'}`}>
                    {rank}
                  </div>
                </div>
                <div className={`w-full pt-4 md:pt-8 pb-4 md:pb-10 px-1 md:px-4 rounded-t-3xl border-t border-x ${borderColor.split(' ')[0]}/30 text-center bg-slate-900/80 backdrop-blur-sm`}>
                  <p className={`font-black mb-0.5 truncate ${isFirst ? 'text-sm md:text-2xl text-yellow-400' : 'text-xs md:text-xl text-white'}`}>{p.name}</p>
                  <p className={`text-primary font-black ${isFirst ? 'text-xs md:text-xl' : 'text-[10px] md:text-lg'}`}>{p.points.toLocaleString()} pts</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* List Section */}
      <div className="w-full max-w-2xl flex flex-col gap-3">
        <LayoutGroup>
          {rest.map((p, idx) => (
            <motion.div 
              key={p.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                type: 'spring',
                stiffness: 300,
                damping: 30,
                delay: 0.6 + idx * 0.05 
              }}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all shadow-sm group ${p.id === currentParticipantId ? 'bg-primary/10 border-primary shadow-primary/10' : 'bg-slate-900/50 border-white/5 hover:border-white/20'}`}
            >
              <div className="w-8 font-black text-slate-500">{idx + 4}º</div>
              <div className="size-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl border border-white/10 group-hover:border-primary transition-colors">
                {p.avatar}
              </div>
              <div className="flex flex-col flex-1">
                <p className="font-bold text-white">{p.name}</p>
                {p.id === currentParticipantId && <p className="text-[10px] text-primary font-black uppercase tracking-widest">Você</p>}
              </div>
              <div className="text-right">
                <p className="font-black text-primary">{p.points.toLocaleString()} pts</p>
              </div>
            </motion.div>
          ))}
        </LayoutGroup>

        {isOutsideTop10 && myData && (
          <>
            <div className="flex justify-center py-4">
              <div className="flex gap-1">
                {[1, 2, 3].map(i => <div key={i} className="size-1.5 bg-slate-700 rounded-full" />)}
              </div>
            </div>
            <motion.div 
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 bg-primary/10 p-4 rounded-2xl border border-primary shadow-lg shadow-primary/10"
            >
              <div className="w-8 font-black text-primary">{myPosition}º</div>
              <div className="size-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl border border-primary">
                {myData.avatar}
              </div>
              <div className="flex flex-col flex-1">
                <p className="font-bold text-white">{myData.name}</p>
                <p className="text-[10px] text-primary font-black uppercase tracking-widest">Sua Posição</p>
              </div>
              <div className="text-right">
                <p className="font-black text-primary">{myData.points.toLocaleString()} pts</p>
              </div>
            </motion.div>
          </>
        )}
      </div>

      <div className="mt-12 flex flex-col items-center gap-6">
        <div className="flex items-center gap-8 text-slate-500 font-bold text-sm">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-primary" />
            <span>{participants.length} Participantes</span>
          </div>
          <div className="flex items-center gap-2">
            <Star size={18} className="text-yellow-400" />
            <span>Top 10 Destaques</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {sortedParticipants.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 right-10 hidden md:block"
          >
            <div className="bg-slate-800/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-4">
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Líder Atual</p>
                <p className="font-black text-white text-lg">{top3[0]?.name}</p>
              </div>
              <div className="size-12 bg-yellow-400 rounded-xl flex items-center justify-center text-slate-900 shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                <Crown size={24} fill="currentColor" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
