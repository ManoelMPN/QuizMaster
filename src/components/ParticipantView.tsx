import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Timer, Loader2 } from 'lucide-react';
import { Question, GameState } from '../types';

interface ParticipantViewProps {
  participantId: string;
  participantName: string;
  gameState: GameState;
  currentQuestion: Question | null;
  onSubmitAnswer: (optionIndex: number) => void;
}

export default function ParticipantView({ participantId, participantName, gameState, currentQuestion, onSubmitAnswer }: ParticipantViewProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

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

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
      <AnimatePresence mode="wait">
        {gameState.status === 'waiting' && (
          <motion.div 
            key="waiting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center space-y-6"
          >
            <div className="text-6xl mb-4">{participantName.split(' ')[0]}</div>
            <h1 className="text-3xl font-black text-white">Você está dentro!</h1>
            <p className="text-xl text-primary font-bold">{participantName.split(' ').slice(1).join(' ')}</p>
            <div className="pt-10 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-primary" size={40} />
              <p className="text-slate-500 font-medium animate-pulse">Aguardando o início do quiz...</p>
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
            className="text-center space-y-6"
          >
            <div className="size-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-primary" size={48} />
            </div>
            <h1 className="text-3xl font-black text-white">Fim da Rodada!</h1>
            <p className="text-slate-400 text-lg">Veja o placar na tela principal</p>
            <div className="pt-10">
              <p className="text-slate-500 font-medium italic">Prepare-se para a próxima...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
