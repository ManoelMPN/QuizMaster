import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Play, RotateCcw, Save, List } from 'lucide-react';
import { Question, Participant, GameState } from '../types';

interface AdminDashboardProps {
  participants: Participant[];
  gameState: GameState;
  onStartQuestion: (id: string) => void;
  onShowRanking: () => void;
  onResetGame: () => void;
}

export default function AdminDashboard({ participants, gameState, onStartQuestion, onShowRanking, onResetGame }: AdminDashboardProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctOption: 0,
    timeLimit: 30
  });

  useEffect(() => {
    fetch('/api/questions').then(res => res.json()).then(setQuestions);
  }, []);

  const handleAddQuestion = async () => {
    if (!newQuestion.text || newQuestion.options.some(o => !o)) return;
    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuestion)
    });
    if (res.ok) {
      const { id } = await res.json();
      setQuestions([...questions, { ...newQuestion, id }]);
      setNewQuestion({ text: '', options: ['', '', '', ''], correctOption: 0, timeLimit: 30 });
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    await fetch(`/api/questions/${id}`, { method: 'DELETE' });
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-white">Painel do Administrador</h1>
        <div className="flex gap-3">
          <button 
            onClick={onShowRanking}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-all"
          >
            <List size={18} /> Mostrar Ranking
          </button>
          <button 
            onClick={onResetGame}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all"
          >
            <RotateCcw size={18} /> Resetar Jogo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Question Creation */}
        <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/10 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Plus className="text-primary" /> Nova Pergunta
          </h2>
          <input 
            type="text" 
            placeholder="Texto da pergunta"
            value={newQuestion.text}
            onChange={e => setNewQuestion({...newQuestion, text: e.target.value})}
            className="w-full p-4 bg-slate-800 border border-white/10 rounded-xl text-white outline-none focus:border-primary"
          />
          <div className="grid grid-cols-2 gap-3">
            {newQuestion.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input 
                  type="radio" 
                  checked={newQuestion.correctOption === idx}
                  onChange={() => setNewQuestion({...newQuestion, correctOption: idx})}
                  className="accent-primary size-5"
                />
                <input 
                  type="text" 
                  placeholder={`Opção ${idx + 1}`}
                  value={opt}
                  onChange={e => {
                    const opts = [...newQuestion.options];
                    opts[idx] = e.target.value;
                    setNewQuestion({...newQuestion, options: opts});
                  }}
                  className="flex-1 p-3 bg-slate-800 border border-white/10 rounded-lg text-white outline-none focus:border-primary text-sm"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-slate-500 block mb-1">Tempo Limite (segundos)</label>
              <input 
                type="number" 
                value={newQuestion.timeLimit}
                onChange={e => setNewQuestion({...newQuestion, timeLimit: parseInt(e.target.value)})}
                className="w-full p-3 bg-slate-800 border border-white/10 rounded-lg text-white outline-none focus:border-primary"
              />
            </div>
            <button 
              onClick={handleAddQuestion}
              className="h-12 px-6 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2 mt-5"
            >
              <Save size={18} /> Salvar
            </button>
          </div>
        </div>

        {/* Question List */}
        <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/10 space-y-4">
          <h2 className="text-xl font-bold text-white">Perguntas Cadastradas</h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {questions.map(q => (
              <div key={q.id} className="p-4 bg-slate-800 rounded-xl border border-white/5 flex items-center justify-between group">
                <div className="flex-1">
                  <p className="font-bold text-white mb-1">{q.text}</p>
                  <p className="text-xs text-slate-500">{q.options.length} opções • {q.timeLimit}s</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => onStartQuestion(q.id)}
                    className="p-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                    title="Iniciar Pergunta"
                  >
                    <Play size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {questions.length === 0 && (
              <p className="text-center text-slate-500 py-10 italic">Nenhuma pergunta cadastrada.</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 text-center">
          <p className="text-slate-500 text-sm uppercase font-bold tracking-widest mb-1">Participantes</p>
          <p className="text-4xl font-black text-white">{participants.length}</p>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 text-center">
          <p className="text-slate-500 text-sm uppercase font-bold tracking-widest mb-1">Status do Jogo</p>
          <p className="text-2xl font-black text-primary uppercase">{gameState.status === 'waiting' ? 'Aguardando' : gameState.status === 'question' ? 'Em Pergunta' : 'Ranking'}</p>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 text-center">
          <p className="text-slate-500 text-sm uppercase font-bold tracking-widest mb-1">Total de Perguntas</p>
          <p className="text-4xl font-black text-white">{questions.length}</p>
        </div>
      </div>
    </div>
  );
}
