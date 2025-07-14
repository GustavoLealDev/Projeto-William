const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'MerceariaDB'
});

// Conectar ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL!');
});

// Rota para cadastrar usuários
app.post('/usuarios', (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    const query = 'INSERT INTO Usuario (nome, email, senha) VALUES (?, ?, ?)';
    db.query(query, [nome, email, senha], (err, result) => {
        if (err) {
            console.error('Erro ao cadastrar usuário:', err);
            return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
        }
        res.json({ message: 'Usuário cadastrado com sucesso!', usuario: { id: result.insertId, nome, email, senha } });
    });
});

// Rota para login de usuários
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    const query = 'SELECT * FROM Usuario WHERE email = ? AND senha = ?';
    db.query(query, [email, senha], (err, results) => {
        if (err) {
            console.error('Erro ao fazer login:', err);
            return res.status(500).json({ message: 'Erro ao fazer login.' });
        }
        if (results.length > 0) {
            res.json({ message: 'Login realizado com sucesso!', usuario: results[0] });
        } else {
            res.status(401).json({ message: 'Email ou senha incorretos.' });
        }
    });
});

// Rota para cadastrar produtos
app.post('/produtos', (req, res) => {
    const { nome, descricao, preco, quantidade } = req.body;
    if (!nome || !descricao || !preco || !quantidade) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    const query = 'INSERT INTO Produto (nome, descricao, preco, quantidade) VALUES (?, ?, ?, ?)';
    db.query(query, [nome, descricao, preco, quantidade], (err, result) => {
        if (err) {
            console.error('Erro ao cadastrar produto:', err);
            return res.status(500).json({ message: 'Erro ao cadastrar produto.' });
        }
        res.json({ message: 'Produto cadastrado com sucesso!', produto: { id: result.insertId, nome, descricao, preco, quantidade } });
    });
});

// Rota para listar produtos
app.get('/produtos', (req, res) => {
    const query = 'SELECT * FROM Produto';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao listar produtos:', err);
            return res.status(500).json({ message: 'Erro ao listar produtos.' });
        }
        res.json(results);
    });
});

