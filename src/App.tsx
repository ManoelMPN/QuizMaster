import { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import JoinScreen from './components/JoinScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import ParticipantView from './components/ParticipantView';
import { Screen, User, Participant, GameState, Question } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { getMe, logout } from './services/api';
import { LogOut, LayoutDashboard, Users as UsersIcon, Trophy } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('join');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [gameState, setGameState] = useState<GameState>({ currentQuestionId: null, status: 'waiting' });
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(localStorage.getItem('participantId'));
  const [participantName, setParticipantName] = useState<string | null>(localStorage.getItem('participantName'));
  
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Check for admin auth
    getMe().then(u => {
      if (u) setUser(u);
      setLoading(false);
    });

    // Handle auto-join for participants
    if (window.location.pathname === '/join' && !participantId) {
      fetch('/api/join', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          setParticipantId(data.id);
          setParticipantName(data.name);
          localStorage.setItem('participantId', data.id);
          localStorage.setItem('participantName', data.name);
          setCurrentScreen('participant');
        });
    } else if (participantId) {
      setCurrentScreen('participant');
    }

    // WebSocket Connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.type === 'SYNC' || payload.type === 'RANKING_UPDATE') {
        setParticipants(payload.participants);
        setGameState(payload.gameState);
      }
      if (payload.type === 'QUESTION_STARTED') {
        setCurrentQuestion(payload.question);
        setGameState(payload.gameState);
      }
    };

    return () => socket.close();
  }, [participantId]);

  const handleAuthSuccess = (u: User) => {
    setUser(u);
    setCurrentScreen('admin');
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setCurrentScreen('join');
  };

  const startQuestion = (questionId: string) => {
    socketRef.current?.send(JSON.stringify({ type: 'START_QUESTION', questionId }));
  };

  const startCountdown = (questionId: string) => {
    socketRef.current?.send(JSON.stringify({ type: 'START_COUNTDOWN', questionId }));
  };

  const updateName = (newName: string) => {
    if (!participantId) return;
    socketRef.current?.send(JSON.stringify({ type: 'UPDATE_NAME', participantId, newName }));
    setParticipantName(newName);
    localStorage.setItem('participantName', newName);
  };

  const showRanking = () => {
    socketRef.current?.send(JSON.stringify({ type: 'SHOW_RANKING' }));
  };

  const resetGame = () => {
    socketRef.current?.send(JSON.stringify({ type: 'RESET_GAME' }));
  };

  const submitAnswer = (optionIndex: number) => {
    if (!participantId || !currentQuestion) return;
    socketRef.current?.send(JSON.stringify({ 
      type: 'SUBMIT_ANSWER', 
      participantId, 
      questionId: currentQuestion.id, 
      optionIndex 
    }));
  };

  if (loading) return null;

  return (
    <Layout title={user ? `Admin: ${user.name}` : participantName ? `Participando como ${participantName}` : "Quiz Master"}>
      {user && (
        <div className="fixed top-20 right-6 z-[100] flex items-center gap-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentScreen('join')}
              className={`p-2 rounded-lg transition-all ${currentScreen === 'join' ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              title="Tela de Entrada"
            >
              <UsersIcon size={20} />
            </button>
            <button 
              onClick={() => setCurrentScreen('admin')}
              className={`p-2 rounded-lg transition-all ${currentScreen === 'admin' ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              title="Painel Admin"
            >
              <LayoutDashboard size={20} />
            </button>
            <button 
              onClick={() => setCurrentScreen('leaderboard')}
              className={`p-2 rounded-lg transition-all ${currentScreen === 'leaderboard' ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              title="Placar"
            >
              <Trophy size={20} />
            </button>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
            title="Sair"
          >
            <LogOut size={20} />
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          {currentScreen === 'auth' && <Auth onSuccess={handleAuthSuccess} />}
          {currentScreen === 'join' && <JoinScreen participants={participants} />}
          {currentScreen === 'leaderboard' && <LeaderboardScreen participants={participants} currentParticipantId={participantId} />}
          {currentScreen === 'admin' && user && (
            <AdminDashboard 
              participants={participants} 
              gameState={gameState} 
              onStartQuestion={startCountdown}
              onShowRanking={showRanking}
              onResetGame={resetGame}
            />
          )}
          {currentScreen === 'participant' && participantId && participantName && (
            <ParticipantView 
              participantId={participantId}
              participantName={participantName}
              gameState={gameState}
              currentQuestion={currentQuestion}
              onSubmitAnswer={submitAnswer}
              onUpdateName={updateName}
              participants={participants}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

