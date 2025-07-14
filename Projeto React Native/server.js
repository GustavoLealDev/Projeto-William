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

// Rota para atualizar produtos
app.put('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, quantidade } = req.body;
    const query = 'UPDATE Produto SET nome = ?, descricao = ?, preco = ?, quantidade = ? WHERE id = ?';
    db.query(query, [nome, descricao, preco, quantidade, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar produto:', err);
            return res.status(500).json({ message: 'Erro ao atualizar produto.' });
        }
        res.json({ message: 'Produto atualizado com sucesso!' });
    });
});

// Rota para excluir produtos com verificação de senha
app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { senha } = req.body;
    const queryCheck = 'SELECT * FROM Usuario WHERE senha = ?';
    db.query(queryCheck, [senha], (err, results) => {
        if (err) {
            console.error('Erro ao verificar senha:', err);
            return res.status(500).json({ message: 'Erro ao verificar senha.' });
        }
        if (results.length > 0) {
            const queryDelete = 'DELETE FROM Produto WHERE id = ?';
            db.query(queryDelete, [id], (err, result) => {
                if (err) {
                    console.error('Erro ao excluir produto:', err);
                    return res.status(500).json({ message: 'Erro ao excluir produto.' });
                }
                res.json({ message: 'Produto excluído com sucesso!' });
            });
        } else {
            res.status(401).json({ message: 'Senha incorreta.' });
        }
    });
});

// Rota para registrar venda
app.post('/vender', (req, res) => {
    const { id, quantidadeVendida } = req.body;
    const querySelect = 'SELECT quantidade, preco FROM Produto WHERE id = ?';
    db.query(querySelect, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar produto:', err);
            return res.status(500).json({ message: 'Erro ao buscar produto.' });
        }
        if (results.length > 0) {
            const quantidadeAtual = results[0].quantidade;
            const preco = results[0].preco;
            const novaQuantidade = quantidadeAtual - quantidadeVendida;
            const queryUpdate = 'UPDATE Produto SET quantidade = ? WHERE id = ?';
            db.query(queryUpdate, [novaQuantidade < 0 ? 0 : novaQuantidade, id], (err) => {
                if (err) {
                    console.error('Erro ao atualizar produto:', err);
                    return res.status(500).json({ message: 'Erro ao atualizar produto.' });
                }
                const queryInsert = 'INSERT INTO Venda (produto_id, quantidade, valor) VALUES (?, ?, ?)';
                db.query(queryInsert, [id, quantidadeVendida, preco * quantidadeVendida], (err) => {
                    if (err) {
                        console.error('Erro ao registrar venda:', err);
                        return res.status(500).json({ message: 'Erro ao registrar venda.' });
                    }
                    res.json({ message: 'Venda registrada com sucesso!' });
                });
            });
        } else {
            res.status(404).json({ message: 'Produto não encontrado.' });
        }
    });
});

