import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Timer, Loader2 } from 'lucide-react';
import { Question, GameState, Participant } from '../types';
import LeaderboardScreen from './LeaderboardScreen';

interface ParticipantViewProps {
  participantId: string;
  participantName: string;
  gameState: GameState;
  currentQuestion: Question | null;
  onSubmitAnswer: (optionIndex: number) => void;
  onUpdateName: (newName: string) => void;
  participants: Participant[];
}

export default function ParticipantView({ participantId, participantName, gameState, currentQuestion, onSubmitAnswer, onUpdateName, participants }: ParticipantViewProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(participantName);

  useEffect(() => {
    if (gameState.status === 'question' && currentQuestion) {
      const elapsed = Math.floor((Date.now() - (gameState.questionStartTime || 0)) / 1000);
      setTimeLeft(Math.max(0, currentQuestion.timeLimit - elapsed));
      
      const timer = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [gameState.status, currentQuestion, gameState.questionStartTime]);

  useEffect(() => {
    if (gameState.status !== 'question') {
      setSelectedOption(null);
    }
  }, [gameState.status]);

  const handleSelect = (idx: number) => {
    if (selectedOption !== null || timeLeft <= 0) return;
    setSelectedOption(idx);
    onSubmitAnswer(idx);
  };

  const handleSaveName = () => {
    if (tempName.trim() && tempName !== participantName) {
      onUpdateName(tempName.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
      <AnimatePresence mode="wait">
        {gameState.status === 'waiting' && (
          <motion.div 
            key="waiting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center space-y-6 w-full"
          >
            <div className="text-6xl mb-4">{participantName.split(' ')[0]}</div>
            
            {isEditing ? (
              <div className="space-y-4 max-w-xs mx-auto">
                <input 
                  type="text" 
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full p-4 bg-slate-800 border-2 border-primary rounded-xl text-white text-center font-bold outline-none"
                  autoFocus
                />
                <button 
                  onClick={handleSaveName}
                  className="w-full p-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20"
                >
                  Salvar Nome
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <h1 className="text-3xl font-black text-white">Você está dentro!</h1>
                <p className="text-xl text-primary font-bold">{participantName.split(' ').slice(1).join(' ')}</p>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-slate-500 text-sm font-bold underline underline-offset-4 hover:text-primary transition-colors"
                >
                  Editar meu nome
                </button>
              </div>
            )}

            <div className="pt-10 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-primary" size={40} />
              <p className="text-slate-500 font-medium animate-pulse">Aguardando o início do quiz...</p>
            </div>
          </motion.div>
        )}

        {gameState.status === 'countdown' && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex flex-col items-center justify-center"
          >
            <h2 className="text-slate-500 text-xl font-bold uppercase tracking-[0.2em] mb-4">Prepare-se!</h2>
            <div className="text-[12rem] font-black text-primary leading-none">
              {gameState.countdown}
            </div>
          </motion.div>
        )}

        {gameState.status === 'question' && currentQuestion && (
          <motion.div 
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full space-y-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-primary font-bold">
                <Timer size={20} />
                <span className={timeLeft < 5 ? 'text-red-500 animate-pulse' : ''}>{timeLeft}s</span>
              </div>
              <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">Responda rápido!</div>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white text-center leading-tight">
              {currentQuestion.text}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((opt, idx) => (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.98 }}
                  disabled={selectedOption !== null || timeLeft <= 0}
                  onClick={() => handleSelect(idx)}
                  className={`
                    w-full p-6 rounded-2xl text-left font-bold text-lg transition-all border-2
                    ${selectedOption === idx 
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                      : 'bg-slate-800 border-white/5 text-slate-300 hover:border-primary/50'}
                    ${selectedOption !== null && selectedOption !== idx ? 'opacity-50' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {selectedOption === idx && <div className="size-3 rounded-full bg-white animate-ping" />}
                  </div>
                </motion.button>
              ))}
            </div>

            {selectedOption !== null && (
              <p className="text-center text-primary font-bold animate-pulse">
                Resposta enviada! Aguarde o resultado...
              </p>
            )}
          </motion.div>
        )}

        {gameState.status === 'ranking' && (
          <motion.div 
            key="ranking"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full"
          >
            <LeaderboardScreen 
              participants={participants} 
              currentParticipantId={participantId} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
