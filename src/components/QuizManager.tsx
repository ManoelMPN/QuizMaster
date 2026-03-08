import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Play, List, ChevronRight, Save, X } from 'lucide-react';
import { Quiz, Question } from '../types';
import { getQuizzes, createQuiz, deleteQuiz, getQuestions, createQuestion } from '../services/api';

interface QuizManagerProps {
  onSelectQuiz: (quizId: string) => void;
  activeQuizId: string | null;
}

export default function QuizManager({ onSelectQuiz, activeQuizId }: QuizManagerProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [showNewQuizModal, setShowNewQuizModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newQuestion, setNewQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctOption: 0,
    timeLimit: 30
  });

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const data = await getQuizzes();
      setQuizzes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    if (!newQuizTitle) return;
    try {
      const quiz = await createQuiz(newQuizTitle);
      setQuizzes([quiz, ...quizzes]);
      setNewQuizTitle('');
      setShowNewQuizModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteQuiz = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Tem certeza que deseja excluir este quiz?')) return;
    try {
      await deleteQuiz(id);
      setQuizzes(quizzes.filter(q => q.id !== id));
      if (selectedQuiz?.id === id) setSelectedQuiz(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectQuiz = async (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    try {
      const data = await getQuestions(quiz.id);
      setQuestions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddQuestion = async () => {
    if (!selectedQuiz || !newQuestion.text || newQuestion.options.some(o => !o)) return;
    try {
      const { id } = await createQuestion({ ...newQuestion, quizId: selectedQuiz.id });
      setQuestions([...questions, { ...newQuestion, id, quizId: selectedQuiz.id }]);
      setNewQuestion({ text: '', options: ['', '', '', ''], correctOption: 0, timeLimit: 30 });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Carregando quizzes...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      {/* Quiz List */}
      <div className="lg:col-span-1 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg md:text-xl font-black text-white">Seus Quizzes</h2>
          <button 
            onClick={() => setShowNewQuizModal(true)}
            className="p-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all active:scale-95"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 no-scrollbar">
          {quizzes.map(quiz => (
            <div
              key={quiz.id}
              onClick={() => handleSelectQuiz(quiz)}
              className={`min-w-[240px] lg:min-w-0 w-full p-4 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${selectedQuiz?.id === quiz.id ? 'bg-primary/10 border-primary shadow-lg shadow-primary/5' : 'bg-slate-900/50 border-white/10 hover:border-white/20'}`}
            >
              <div className="text-left">
                <p className={`font-bold ${selectedQuiz?.id === quiz.id ? 'text-primary' : 'text-white'}`}>{quiz.title}</p>
                <p className="text-xs text-slate-500">{new Date(quiz.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => handleDeleteQuiz(quiz.id, e)}
                  className="p-2 text-slate-500 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
                <ChevronRight size={16} className={selectedQuiz?.id === quiz.id ? 'text-primary' : 'text-slate-500'} />
              </div>
            </div>
          ))}
          {quizzes.length === 0 && (
            <div className="text-center py-10 bg-slate-900/30 rounded-2xl border border-dashed border-white/10">
              <p className="text-slate-500 text-sm italic">Nenhum quiz criado ainda.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Details / Questions */}
      <div className="lg:col-span-2">
        <AnimatePresence mode="wait">
          {selectedQuiz ? (
            <motion.div 
              key={selectedQuiz.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900/50 p-4 md:p-6 rounded-3xl border border-white/10 gap-4">
                <div className="text-center sm:text-left">
                  <h2 className="text-xl md:text-2xl font-black text-white">{selectedQuiz.title}</h2>
                  <p className="text-slate-400 text-sm">{questions.length} perguntas cadastradas</p>
                </div>
                <button 
                  onClick={() => onSelectQuiz(selectedQuiz.id)}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black transition-all ${activeQuizId === selectedQuiz.id ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-primary text-white hover:opacity-90'}`}
                >
                  <Play size={20} /> {activeQuizId === selectedQuiz.id ? 'Apresentando...' : 'Apresentar Quiz'}
                </button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* New Question Form */}
                <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/10 space-y-4 h-fit">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Plus className="text-primary" /> Nova Pergunta
                  </h3>
                  <input 
                    type="text" 
                    placeholder="Texto da pergunta"
                    value={newQuestion.text}
                    onChange={e => setNewQuestion({...newQuestion, text: e.target.value})}
                    className="w-full p-4 bg-slate-800 border border-white/10 rounded-xl text-white outline-none focus:border-primary"
                  />
                  <div className="grid grid-cols-1 gap-3">
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
                      <label className="text-xs text-slate-500 block mb-1">Tempo (s)</label>
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

                {/* Questions List */}
                <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/10 space-y-4">
                  <h3 className="text-lg font-bold text-white">Perguntas do Quiz</h3>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {questions.map((q, idx) => (
                      <div key={q.id} className="p-4 bg-slate-800 rounded-xl border border-white/5 flex items-center justify-between group">
                        <div className="flex-1">
                          <p className="font-bold text-white mb-1">{idx + 1}. {q.text}</p>
                          <p className="text-xs text-slate-500">{q.options.length} opções • {q.timeLimit}s</p>
                        </div>
                        <button 
                          onClick={async () => {
                            await fetch(`/api/questions/${q.id}`, { method: 'DELETE' });
                            setQuestions(questions.filter(item => item.id !== q.id));
                          }}
                          className="p-2 text-slate-500 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {questions.length === 0 && (
                      <p className="text-center text-slate-500 py-10 italic text-sm">Nenhuma pergunta cadastrada.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-900/30 rounded-3xl border border-dashed border-white/10">
              <List size={48} className="text-slate-700 mb-4" />
              <h3 className="text-xl font-bold text-slate-400">Selecione um quiz</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Escolha um quiz na lista ao lado para gerenciar suas perguntas ou iniciar a apresentação.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* New Quiz Modal */}
      <AnimatePresence>
        {showNewQuizModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-white">Novo Quiz</h3>
                <button onClick={() => setShowNewQuizModal(false)} className="text-slate-500 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">Título do Quiz</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={newQuizTitle}
                    onChange={e => setNewQuizTitle(e.target.value)}
                    placeholder="Ex: Conhecimentos Gerais"
                    className="w-full p-4 bg-slate-800 border border-white/10 rounded-xl text-white outline-none focus:border-primary"
                  />
                </div>
                <button 
                  onClick={handleCreateQuiz}
                  className="w-full py-4 bg-primary text-white font-black rounded-xl hover:opacity-90 transition-all"
                >
                  Criar Quiz
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
