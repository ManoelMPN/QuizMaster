import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Play, RotateCcw, Save, List, LayoutDashboard, User as UserIcon, Trophy, Settings, QrCode } from 'lucide-react';
import { Question, Participant, GameState, User, Quiz } from '../types';
import QuizManager from './QuizManager';
import PresenterProfile from './PresenterProfile';

interface AdminDashboardProps {
  user: User;
  participants: Participant[];
  gameState: GameState;
  onStartQuestion: (id: string) => void;
  onShowRanking: () => void;
  onResetGame: () => void;
  onSelectQuiz: (quizId: string) => void;
  onUpdateUser: (user: User) => void;
}

export default function AdminDashboard({ 
  user, 
  participants, 
  gameState, 
  onStartQuestion, 
  onShowRanking, 
  onResetGame,
  onSelectQuiz,
  onUpdateUser
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'quizzes' | 'live' | 'profile'>('quizzes');
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (gameState.activeQuizId) {
      fetch(`/api/questions/${gameState.activeQuizId}`)
        .then(res => res.json())
        .then(setActiveQuizQuestions);
    }
  }, [gameState.activeQuizId]);

  return (
    <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <button 
            onClick={() => setActiveTab('profile')}
            className="size-14 md:size-16 bg-primary/20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl hover:scale-105 transition-all flex-shrink-0"
          >
            {user.avatar || '👤'}
          </button>
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-black text-white truncate">Olá, {user.name}</h1>
            <p className="text-slate-500 text-xs md:text-sm truncate">Gerencie seus quizzes e apresentações</p>
          </div>
        </div>

        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/10 w-full lg:w-auto overflow-x-auto no-scrollbar">
          <div className="flex min-w-max">
            <button 
              onClick={() => {
                window.open('/join?present=true', '_blank');
              }}
              className="flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl font-bold transition-all text-slate-400 hover:text-white whitespace-nowrap"
              title="Abrir tela de entrada com QR Code"
            >
              <QrCode size={18} /> <span className="hidden sm:inline">QR Code</span>
            </button>
            <button 
              onClick={() => setActiveTab('quizzes')}
              className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'quizzes' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white'}`}
            >
              <List size={18} /> <span className="hidden sm:inline">Meus Quizzes</span><span className="sm:hidden">Quizzes</span>
            </button>
            <button 
              onClick={() => setActiveTab('live')}
              className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'live' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white'}`}
            >
              <LayoutDashboard size={18} /> <span className="hidden sm:inline">Ao Vivo</span><span className="sm:hidden">Live</span>
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'profile' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white'}`}
            >
              <Settings size={18} /> <span className="hidden sm:inline">Perfil</span><span className="sm:hidden">Perfil</span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'quizzes' && (
          <motion.div
            key="quizzes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <QuizManager onSelectQuiz={onSelectQuiz} activeQuizId={gameState.activeQuizId} />
          </motion.div>
        )}

        {activeTab === 'live' && (
          <motion.div
            key="live"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {!gameState.activeQuizId ? (
              <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-white/10">
                <Play size={48} className="text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-400">Nenhum quiz ativo</h3>
                <p className="text-slate-500 mb-6">Selecione um quiz na aba "Meus Quizzes" para começar a apresentar.</p>
                <button 
                  onClick={() => setActiveTab('quizzes')}
                  className="px-8 py-3 bg-primary text-white font-black rounded-xl hover:opacity-90 transition-all"
                >
                  Ir para Meus Quizzes
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row items-center justify-between bg-slate-900/50 p-4 md:p-6 rounded-3xl border border-white/10 gap-4">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="size-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-500 animate-pulse flex-shrink-0">
                      <Play size={24} />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-black text-white">Quiz em Andamento</h2>
                      <p className="text-slate-500 text-xs md:text-sm">Controle a apresentação ao vivo</p>
                    </div>
                  </div>
                  <div className="flex gap-2 md:gap-3 w-full md:w-auto">
                    <button 
                      onClick={onShowRanking}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all text-sm md:text-base"
                    >
                      <Trophy size={18} /> <span className="hidden sm:inline">Ranking</span><span className="sm:hidden">Placar</span>
                    </button>
                    <button 
                      onClick={onResetGame}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all text-sm md:text-base"
                    >
                      <RotateCcw size={18} /> <span className="hidden sm:inline">Resetar</span><span className="sm:hidden">Reset</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-white">Controle de Perguntas</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {activeQuizQuestions.map((q, idx) => (
                        <div key={q.id} className={`p-5 rounded-2xl border transition-all flex items-center justify-between group ${gameState.currentQuestionId === q.id ? 'bg-primary/10 border-primary' : 'bg-slate-900/50 border-white/10'}`}>
                          <div>
                            <p className="font-bold text-white">{idx + 1}. {q.text}</p>
                            <p className="text-xs text-slate-500">{q.timeLimit}s • {q.options.length} opções</p>
                          </div>
                          <button 
                            onClick={() => onStartQuestion(q.id)}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${gameState.currentQuestionId === q.id ? 'bg-green-500 text-white' : 'bg-primary text-white hover:opacity-90'}`}
                          >
                            {gameState.currentQuestionId === q.id ? 'Ativa' : 'Iniciar'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/10 text-center">
                      <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-2">Participantes Conectados</p>
                      <p className="text-5xl font-black text-white">{participants.length}</p>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {participants.slice(0, 12).map(p => (
                          <div key={p.id} className="size-8 bg-slate-800 rounded-lg flex items-center justify-center text-lg border border-white/5" title={p.name}>
                            {p.avatar}
                          </div>
                        ))}
                        {participants.length > 12 && (
                          <div className="size-8 bg-slate-800 rounded-lg flex items-center justify-center text-xs text-slate-500 border border-white/5">
                            +{participants.length - 12}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/10">
                      <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Status da Sala</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Estado</span>
                          <span className="font-bold text-primary uppercase">{gameState.status}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Quiz ID</span>
                          <span className="font-mono text-slate-300">{gameState.activeQuizId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <PresenterProfile user={user} onUpdate={onUpdateUser} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
