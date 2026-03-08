import express from "express";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { gerarPersonaUnica } from "./src/constants";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "quiz-master-secret-key";
const db = new Database("quiz.db");

// Database Initialization
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    avatar TEXT
  );
  CREATE TABLE IF NOT EXISTS quizzes (
    id TEXT PRIMARY KEY,
    title TEXT,
    user_id TEXT,
    created_at INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    quiz_id TEXT,
    text TEXT,
    options TEXT, -- JSON array
    correct_option INTEGER,
    time_limit INTEGER,
    FOREIGN KEY(quiz_id) REFERENCES quizzes(id)
  );
  CREATE TABLE IF NOT EXISTS participants (
    id TEXT PRIMARY KEY,
    name TEXT,
    avatar TEXT,
    points INTEGER DEFAULT 0,
    status TEXT,
    joined_at INTEGER
  );
  CREATE TABLE IF NOT EXISTS answers (
    participant_id TEXT,
    question_id TEXT,
    option_index INTEGER,
    response_time INTEGER,
    is_correct INTEGER,
    PRIMARY KEY (participant_id, question_id)
  );
`);

// Migrations
try {
  db.prepare("ALTER TABLE questions ADD COLUMN quiz_id TEXT").run();
} catch (e) {}
try {
  db.prepare("ALTER TABLE participants ADD COLUMN joined_at INTEGER").run();
} catch (e) {}

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  app.use(express.json());
  app.use(cookieParser());

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Game State
  let gameState = {
    currentQuestionId: null as string | null,
    activeQuizId: null as string | null,
    status: 'waiting' as 'waiting' | 'countdown' | 'question' | 'ranking' | 'finished',
    questionStartTime: 0,
    countdown: 0
  };

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, name, avatar } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: "Preencha todos os campos" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const id = Math.random().toString(36).substr(2, 9);
      db.prepare("INSERT INTO users (id, email, password, name, avatar) VALUES (?, ?, ?, ?, ?)").run(id, email, hashedPassword, name, avatar || "👤");
      const token = jwt.sign({ id, email, name, avatar: avatar || "👤" }, JWT_SECRET);
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'none' });
      res.json({ user: { id, email, name, avatar: avatar || "👤" } });
    } catch (err: any) {
      console.error("Register error:", err);
      if (err.message?.includes("UNIQUE")) {
        return res.status(400).json({ error: "E-mail já cadastrado" });
      }
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, avatar: user.avatar }, JWT_SECRET);
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar } });
  });

  app.post("/api/auth/update", async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Não logado" });
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const { name, password, avatar } = req.body;
      
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.prepare("UPDATE users SET name = ?, password = ?, avatar = ? WHERE id = ?").run(name, hashedPassword, avatar, decoded.id);
      } else {
        db.prepare("UPDATE users SET name = ?, avatar = ? WHERE id = ?").run(name, avatar, decoded.id);
      }

      const user: any = db.prepare("SELECT id, email, name, avatar FROM users WHERE id = ?").get(decoded.id);
      const newToken = jwt.sign(user, JWT_SECRET);
      res.cookie("token", newToken, { httpOnly: true, secure: true, sameSite: 'none' });
      res.json({ user });
    } catch (err) {
      res.status(401).json({ error: "Erro ao atualizar perfil" });
    }
  });

  app.get("/api/auth/me", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Não logado" });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.json({ user: decoded });
    } catch (err) {
      res.status(401).json({ error: "Sessão expirada" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true });
  });

  // Quiz Management Routes
  app.get("/api/quizzes", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Não logado" });
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const quizzes = db.prepare("SELECT * FROM quizzes WHERE user_id = ? ORDER BY created_at DESC").all(decoded.id);
      res.json(quizzes);
    } catch (err) {
      res.status(401).json({ error: "Erro ao buscar quizzes" });
    }
  });

  app.post("/api/quizzes", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Não logado" });
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const { title } = req.body;
      const id = Math.random().toString(36).substr(2, 9);
      db.prepare("INSERT INTO quizzes (id, title, user_id, created_at) VALUES (?, ?, ?, ?)")
        .run(id, title, decoded.id, Date.now());
      res.json({ id, title });
    } catch (err) {
      res.status(401).json({ error: "Erro ao criar quiz" });
    }
  });

  app.delete("/api/quizzes/:id", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Não logado" });
    db.prepare("DELETE FROM questions WHERE quiz_id = ?").run(req.params.id);
    db.prepare("DELETE FROM quizzes WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Admin Question Routes
  app.get("/api/questions/:quizId", (req, res) => {
    const questions = db.prepare("SELECT * FROM questions WHERE quiz_id = ?").all(req.params.quizId).map((q: any) => ({
      ...q,
      options: JSON.parse(q.options)
    }));
    res.json(questions);
  });

  app.post("/api/questions", (req, res) => {
    const { quizId, text, options, correctOption, timeLimit } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    db.prepare("INSERT INTO questions (id, quiz_id, text, options, correct_option, time_limit) VALUES (?, ?, ?, ?, ?, ?)")
      .run(id, quizId, text, JSON.stringify(options), correctOption, timeLimit);
    res.json({ id });
  });

  app.delete("/api/questions/:id", (req, res) => {
    db.prepare("DELETE FROM questions WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Participant Join (No login)
  app.post("/api/join", (req, res) => {
    const usados = new Set<string>(db.prepare("SELECT name FROM participants").all().map((p: any) => p.name as string));
    const persona = gerarPersonaUnica(usados);
    const id = Math.random().toString(36).substr(2, 9);
    const avatar = persona.split(' ')[0];
    const name = persona.split(' ').slice(1).join(' ');
    
    db.prepare("INSERT INTO participants (id, name, avatar, points, joined_at) VALUES (?, ?, ?, 0, ?)")
      .run(id, name, avatar, Date.now());
    res.json({ id, name, avatar });
  });

  // WebSocket Logic
  const clients = new Set<WebSocket>();
  wss.on("connection", (ws) => {
    clients.add(ws);
    ws.on("close", () => clients.delete(ws));
    
    // Send initial state
    const participants = db.prepare("SELECT * FROM participants ORDER BY points DESC").all();
    ws.send(JSON.stringify({ type: "SYNC", participants, gameState }));

    ws.on("message", (message) => {
      try {
        const payload = JSON.parse(message.toString());
        
        if (payload.type === "SELECT_QUIZ") {
        gameState.activeQuizId = payload.quizId;
        broadcast({ type: "SYNC", participants: db.prepare("SELECT * FROM participants ORDER BY points DESC").all(), gameState });
      }

      if (payload.type === "START_COUNTDOWN") {
        gameState.status = 'countdown';
        gameState.countdown = 3;
        gameState.currentQuestionId = payload.questionId;
        broadcast({ type: "COUNTDOWN_STARTED", gameState });
        
        const timer = setInterval(() => {
          gameState.countdown! -= 1;
          if (gameState.countdown! < 0) {
            clearInterval(timer);
            // Start the question automatically after countdown
            gameState.status = 'question';
            gameState.questionStartTime = Date.now();
            const question: any = db.prepare("SELECT * FROM questions WHERE id = ?").get(gameState.currentQuestionId);
            broadcast({ type: "QUESTION_STARTED", question: { ...question, options: JSON.parse(question.options) }, gameState });
          } else {
            broadcast({ type: "SYNC", participants: db.prepare("SELECT * FROM participants ORDER BY points DESC").all(), gameState });
          }
        }, 1000);
      }

      if (payload.type === "UPDATE_NAME") {
        const { participantId, newName } = payload;
        try {
          db.prepare("UPDATE participants SET name = ? WHERE id = ?").run(newName, participantId);
          const participants = db.prepare("SELECT * FROM participants ORDER BY points DESC").all();
          broadcast({ type: "SYNC", participants, gameState });
        } catch (e) {
          // Name already exists or other error
        }
      }

      if (payload.type === "START_QUESTION") {
        gameState = {
          ...gameState,
          currentQuestionId: payload.questionId,
          status: 'question',
          questionStartTime: Date.now(),
          countdown: 0
        };
        const question: any = db.prepare("SELECT * FROM questions WHERE id = ?").get(payload.questionId);
        broadcast({ type: "QUESTION_STARTED", question: { ...question, options: JSON.parse(question.options) }, gameState });
      }

      if (payload.type === "SUBMIT_ANSWER") {
        const { participantId, questionId, optionIndex } = payload;
        const question: any = db.prepare("SELECT * FROM questions WHERE id = ?").get(questionId);
        const responseTime = Date.now() - gameState.questionStartTime;
        const isCorrect = optionIndex === question.correct_option;
        
        try {
          db.prepare("INSERT INTO answers (participant_id, question_id, option_index, response_time, is_correct) VALUES (?, ?, ?, ?, ?)")
            .run(participantId, questionId, optionIndex, responseTime, isCorrect ? 1 : 0);
          
          if (isCorrect) {
            // Scoring: 1000 base points + speed bonus (max 1000)
            const speedBonus = Math.max(0, 1000 - Math.floor((responseTime / (question.time_limit * 1000)) * 1000));
            const points = 1000 + speedBonus;
            db.prepare("UPDATE participants SET points = points + ? WHERE id = ?").run(points, participantId);
          }
        } catch (e) {
          // Already answered
        }
      }

      if (payload.type === "SHOW_RANKING") {
        gameState.status = 'ranking';
        const participants = db.prepare("SELECT * FROM participants ORDER BY points DESC").all();
        broadcast({ type: "RANKING_UPDATE", participants, gameState });
      }

      if (payload.type === "RESET_GAME") {
        db.prepare("DELETE FROM participants").run();
        db.prepare("DELETE FROM answers").run();
        gameState = { ...gameState, currentQuestionId: null, status: 'waiting', questionStartTime: 0, countdown: 0 };
        broadcast({ type: "SYNC", participants: [], gameState });
      }
    } catch (e) {
      console.error("WebSocket message error:", e);
    }
  });
});

  const broadcast = (message: any) => {
    const payload = JSON.stringify(message);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  };

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  // Error handling middleware
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  });

  const PORT = 3000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer();
