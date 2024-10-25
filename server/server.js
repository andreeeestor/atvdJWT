import express from 'express';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || 'supersecretkey';

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error('Erro ao conectar ao banco de dados:', err);
  else console.log('Conectado ao banco de dados SQLite.');
});

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL
);`);

function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1h' });
}

app.post('/auth/register', (req, res) => {
  const { email, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(`INSERT INTO users (email, password, role) VALUES (?, ?, ?)`, [email, hashedPassword, role], (err) => {
    if (err) return res.status(400).json({ error: 'Usuário já existe ou dados inválidos' });
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  });
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    const token = generateToken(user);
    res.json({ token });
  });
});

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Falha ao autenticar o token' });
    req.user = user;
    next();
  });
}

app.get('/protected', authenticateJWT, (req, res) => {
  if (req.user.role === 'user' || req.user.role === 'admin') {
    res.json({ message: `Olá, ${req.user.role}! Você tem acesso.` });
  } else {
    res.status(403).json({ message: 'Acesso negado' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

function authorizeAdmin(req, res, next) {
    if (req.user.role === 'admin') {
      next(); 
    } else {
      res.status(403).json({ message: 'Acesso negado: somente administradores podem acessar esta rota' });
    }
  }

app.get('/admin/users', authenticateJWT, authorizeAdmin, (req, res) => {
    db.all(`SELECT id, email, role FROM users`, (err, rows) => {
      if (err) return res.status(500).json({ error: 'Erro ao recuperar usuários' });
      res.json({ users: rows });
    });
  });

app.delete('/admin/users/:id', authenticateJWT, authorizeAdmin, (req, res) => {
    const userId = req.params.id;
  
    db.run(`DELETE FROM users WHERE id = ?`, [userId], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao excluir usuário' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      res.json({ message: 'Usuário excluído com sucesso' });
    });
  });
  
  