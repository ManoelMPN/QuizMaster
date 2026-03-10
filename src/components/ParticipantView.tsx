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
  onJoin: (name: string) => void;
  participants: Participant[];
}

export default function ParticipantView({ participantId, participantName, gameState, currentQuestion, onSubmitAnswer, onUpdateName, onJoin, participants }: ParticipantViewProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isEditing, setIsEditing] = useState(!participantId);
  const [tempName, setTempName] = useState(participantName);

  // Sync tempName when participantName changes from parent (e.g. after join)
  useEffect(() => {
    if (!isEditing && participantName) {
      setTempName(participantName);
    }
  }, [participantName, isEditing]);

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
    if (!tempName.trim()) return;
    
    if (!participantId) {
      onJoin(tempName.trim());
    } else if (tempName !== participantName) {
      onUpdateName(tempName.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 max-w-2xl mx-auto w-full">
      <AnimatePresence mode="wait">
        {(gameState.status === 'waiting' || !participantId) && (
          <motion.div 
            key="waiting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center space-y-6 w-full py-10"
          >
            <div className="size-20 md:size-24 bg-primary/20 rounded-3xl flex items-center justify-center text-5xl md:text-6xl mx-auto shadow-2xl shadow-primary/10">
              {participants.find(p => p.id === participantId)?.avatar || '👤'}
            </div>
            
            {isEditing ? (
              <div className="space-y-4 max-w-xs mx-auto w-full">
                <h2 className="text-xl font-bold text-white">Como quer ser chamado?</h2>
                <input 
                  type="text" 
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Seu nome ou apelido"
                  className="w-full p-4 bg-slate-800 border-2 border-primary rounded-xl text-white text-center font-bold outline-none"
                  autoFocus
                />
                <button 
                  onClick={handleSaveName}
                  className="w-full p-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                >
                  {participantId ? 'Salvar Nome' : 'Entrar no Quiz'}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-black text-white">Você está dentro!</h1>
                <p className="text-lg md:text-xl text-primary font-bold">{participantName}</p>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-slate-500 text-sm font-bold underline underline-offset-4 hover:text-primary transition-colors"
                >
                  Editar meu nome
                </button>
              </div>
            )}

            {participantId && (
              <div className="pt-8 flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-primary" size={32} />
                <p className="text-slate-500 text-sm md:text-base font-medium animate-pulse px-4">Aguardando o mestre iniciar o quiz...</p>
              </div>
            )}
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
            className="w-full space-y-8 relative z-10"
          >
            {currentQuestion.backgroundUrl && (
              <div 
                className="fixed inset-0 -z-10 bg-cover bg-center opacity-30"
                style={{ backgroundImage: `url(${currentQuestion.backgroundUrl})` }}
              />
            )}
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

        {gameState.status === 'answer' && currentQuestion && (
          <motion.div 
            key="answer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full text-center space-y-8"
          >
            {selectedOption === currentQuestion.correctOption ? (
              <div className="space-y-4">
                <div className="size-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mx-auto">
                  <CheckCircle2 size={64} />
                </div>
                <h2 className="text-4xl font-black text-white">CORRETO!</h2>
                <p className="text-slate-400 font-bold">Você foi rápido! +1000 pontos</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="size-24 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mx-auto">
                  <XCircle size={64} />
                </div>
                <h2 className="text-4xl font-black text-white">OPS...</h2>
                <p className="text-slate-400 font-bold">A resposta era: <span className="text-green-500">{currentQuestion.options[currentQuestion.correctOption]}</span></p>
              </div>
            )}
            <div className="pt-8">
              <p className="text-slate-500 animate-pulse">Aguardando o próximo round...</p>
            </div>
          </motion.div>
        )}

        {(gameState.status === 'ranking' || gameState.status === 'finished') && (
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
              isFinal={gameState.status === 'finished'}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
