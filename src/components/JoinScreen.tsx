import React, { useState } from 'react';
import { motion } from 'motion/react';
import { QrCode, Users, Timer, Link2, Copy, RefreshCw, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import LeaderboardScreen from './LeaderboardScreen';
import QRCodeModal from './QRCodeModal';
import { Participant, GameState, Question } from '../types';

interface JoinScreenProps {
  participants: Participant[];
  gameState: GameState;
  currentQuestion: Question | null;
  onAdminLogin: () => void;
  onRegenerateCode: () => void;
}

export default function JoinScreen({ participants, gameState, currentQuestion, onAdminLogin, onRegenerateCode }: JoinScreenProps) {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const roomCode = gameState.roomCode || "------";
  
  // Use current origin or APP_URL if we want to be explicit
  const joinUrl = `${window.location.origin}/join?code=${roomCode}`;

  const [activeQuiz, setActiveQuiz] = useState<any>(null);

  React.useEffect(() => {
    if (gameState.activeQuizId) {
      fetch(`/api/quizzes`)
        .then(res => res.json())
        .then(quizzes => {
          const found = quizzes.find((q: any) => q.id === gameState.activeQuizId);
          setActiveQuiz(found);
        });
    }
  }, [gameState.activeQuizId]);

  if (gameState.status === 'ranking' || gameState.status === 'finished') {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col">
        <LeaderboardScreen 
          participants={participants} 
          isFinal={gameState.status === 'finished'} 
        />
      </div>
    );
  }

  if (gameState.status === 'question' && currentQuestion) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-10 relative overflow-hidden">
        {currentQuestion.backgroundUrl && (
          <div 
            className="absolute inset-0 -z-10 bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url(${currentQuestion.backgroundUrl})` }}
          />
        )}
        <div className="max-w-5xl w-full space-y-12 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-primary/20 border border-primary/30 text-primary font-black text-2xl">
            <Timer size={32} className="animate-pulse" />
            {currentQuestion.timeLimit}s
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
            {currentQuestion.text}
          </h1>
          <div className="grid grid-cols-2 gap-6">
            {currentQuestion.options.map((opt, idx) => (
              <div key={idx} className="p-8 bg-slate-900/80 border-2 border-white/10 rounded-[2rem] text-3xl font-bold text-white">
                {opt}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameState.status === 'answer' && currentQuestion) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-10 relative overflow-hidden">
        <div className="max-w-5xl w-full space-y-12 text-center">
          <h1 className="text-4xl font-black text-slate-400 uppercase tracking-widest">Resposta Correta</h1>
          <div className="p-12 bg-green-500/20 border-4 border-green-500 rounded-[3rem] shadow-[0_0_50px_rgba(34,197,94,0.3)]">
            <h2 className="text-6xl md:text-8xl font-black text-white">
              {currentQuestion.options[currentQuestion.correctOption]}
            </h2>
          </div>
          <div className="pt-12">
             <p className="text-slate-500 text-2xl font-bold animate-pulse">Aguardando o próximo round...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden min-h-screen">
      {/* Background elements */}
      {activeQuiz?.backgroundUrl ? (
        <div 
          className="absolute inset-0 -z-10 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95)), url(${activeQuiz.backgroundUrl})` }}
        />
      ) : (
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/30 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/30 blur-[120px] rounded-full" />
        </div>
      )}

      <button 
        onClick={onAdminLogin}
        className="absolute top-6 right-6 p-2 text-slate-600 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest"
      >
        Acesso Admin
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl text-center space-y-12"
      >
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-sm">
            <div className="size-2 rounded-full bg-primary animate-pulse" />
            Apresentação Ao Vivo
          </div>
          <h1 className="text-white text-6xl md:text-8xl font-black tracking-tighter leading-none">
            VAMOS <span className="text-primary">COMEÇAR?</span>
          </h1>
          <p className="text-slate-400 text-xl md:text-2xl font-medium max-w-2xl mx-auto">
            Escaneie o QR Code ou acesse o link para participar da sessão.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* QR Code Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-slate-900/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl shadow-primary/5 space-y-6"
          >
            <div 
              onClick={() => setIsQRModalOpen(true)}
              className="bg-white p-6 rounded-3xl cursor-pointer hover:scale-[1.02] transition-transform shadow-2xl shadow-primary/20 mx-auto w-full max-w-[280px] aspect-square flex items-center justify-center"
            >
              <QRCodeSVG 
                value={joinUrl} 
                size={240} 
                level="H"
                includeMargin={false}
                fgColor="#0f172a"
                className="w-full h-full"
              />
            </div>
            <div className="space-y-2">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Escaneie para entrar</p>
              <button 
                onClick={() => setIsQRModalOpen(true)}
                className="text-primary font-black hover:underline"
              >
                Ver em tela cheia
              </button>
            </div>
          </motion.div>

          {/* Room Code Card */}
          <div className="space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl shadow-primary/5 text-center space-y-6">
              <div className="space-y-2">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Código da Sala</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-6xl md:text-7xl font-black text-white tracking-[0.2em] font-mono">
                    {roomCode}
                  </div>
                  <button 
                    onClick={onRegenerateCode}
                    className="p-2 text-slate-600 hover:text-primary transition-colors"
                    title="Gerar novo código"
                  >
                    <RefreshCw size={24} />
                  </button>
                </div>
              </div>
              
              <div className="pt-4 space-y-4">
                <p className="text-slate-400 font-medium">Ou acesse manualmente:</p>
                <div className="flex items-center gap-2 p-4 bg-slate-800/50 rounded-2xl border border-white/5 group">
                  <Link2 className="text-primary shrink-0" size={20} />
                  <span className="text-slate-300 font-mono truncate text-sm flex-1">{joinUrl}</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(joinUrl);
                      alert('Link copiado!');
                    }}
                    className="p-2 text-slate-500 hover:text-primary transition-colors"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Participants Counter */}
            <div className="bg-primary/10 p-8 rounded-[2rem] border border-primary/20 flex items-center justify-between">
              <div className="flex flex-col items-start">
                <span className="text-4xl font-black text-white">{participants.length}</span>
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Participantes Reais</span>
              </div>
              <div className="flex -space-x-3">
                {participants.slice(0, 6).map((p) => (
                  <div key={p.id} className="size-12 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center text-2xl shadow-xl">
                    {p.avatar}
                  </div>
                ))}
                {participants.length > 6 && (
                  <div className="size-12 rounded-full border-4 border-slate-900 bg-primary flex items-center justify-center text-xs font-bold text-white shadow-xl">
                    +{participants.length - 6}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <QRCodeModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
        url={joinUrl} 
      />
    </div>
  );
}
