const express = require('express');
const { Op } = require('sequelize');
const mongoose = require('mongoose');
const db = require('./config/db_sequelize');
const db_mongoose = require('./config/db_mongoose');
const logger = require('./logs/logger');

const Avaliacao = require('./models/Avaliacao');

const app = express();
app.use(express.json());
app.use(express.static('public'));

db.sequelize.sync().then(() => {
    console.log('PostgreSQL conectado');
}).catch((err) => {
    logger.registrar('PostgreSQL', err);
});

mongoose.connect(db_mongoose.connection).then(() => {
    console.log('MongoDB conectado');
}).catch((err) => {
    logger.registrar('MongoDB', err);
});

// Grava o erro no log e responde 500
function tratarErro(res, rota, err) {
    logger.registrar(rota, err);
    res.status(500).json({ erro: 'Erro interno no servidor' });
}

// ================= CATEGORIAS =================

app.post('/categorias', async (req, res) => {
    try {
        if (!req.body.nome) {
            return res.status(400).json({ erro: 'Informe o nome' });
        }
        const categoria = await db.Categoria.create({ nome: req.body.nome });
        res.json(categoria);
    } catch (err) {
        tratarErro(res, 'POST /categorias', err);
    }
});

app.get('/categorias', async (req, res) => {
    try {
        const categorias = await db.Categoria.findAll();
        res.json(categorias);
    } catch (err) {
        tratarErro(res, 'GET /categorias', err);
    }
});

app.put('/categorias/:id', async (req, res) => {
    try {
        if (!req.body.nome) {
            return res.status(400).json({ erro: 'Informe o nome' });
        }
        await db.Categoria.update(
            { nome: req.body.nome },
            { where: { id: req.params.id } }
        );
        res.json({ mensagem: 'Categoria atualizada' });
    } catch (err) {
        tratarErro(res, 'PUT /categorias/:id', err);
    }
});

app.delete('/categorias/:id', async (req, res) => {
    try {
        await db.Categoria.destroy({
            where: { id: req.params.id }
        });
        res.json({ mensagem: 'Categoria excluida' });
    } catch (err) {
        tratarErro(res, 'DELETE /categorias/:id', err);
    }
});

// ================= AUTORES =================

app.post('/autores', async (req, res) => {
    try {
        if (!req.body.nome) {
            return res.status(400).json({ erro: 'Informe o nome' });
        }
        const autor = await db.Autor.create({ nome: req.body.nome });
        res.json(autor);
    } catch (err) {
        tratarErro(res, 'POST /autores', err);
    }
});

app.get('/autores', async (req, res) => {
    try {
        const autores = await db.Autor.findAll();
        res.json(autores);
    } catch (err) {
        tratarErro(res, 'GET /autores', err);
    }
});

app.put('/autores/:id', async (req, res) => {
    try {
        if (!req.body.nome) {
            return res.status(400).json({ erro: 'Informe o nome' });
        }
        await db.Autor.update(
            { nome: req.body.nome },
            { where: { id: req.params.id } }
        );
        res.json({ mensagem: 'Autor atualizado' });
    } catch (err) {
        tratarErro(res, 'PUT /autores/:id', err);
    }
});

app.delete('/autores/:id', async (req, res) => {
    try {
        await db.Autor.destroy({
            where: { id: req.params.id }
        });
        res.json({ mensagem: 'Autor excluido' });
    } catch (err) {
        tratarErro(res, 'DELETE /autores/:id', err);
    }
});

// ================= LIVROS =================

app.post('/livros', async (req, res) => {
    try {
        if (!req.body.titulo || !req.body.categoriaId || !req.body.autorId) {
            return res.status(400).json({ erro: 'Informe titulo, categoriaId e autorId' });
        }
        const livro = await db.Livro.create(req.body);
        res.json(livro);
    } catch (err) {
        tratarErro(res, 'POST /livros', err);
    }
});

// Lista em ordem de titulo. Filtros opcionais:
// /livros?categoriaId=1   /livros?titulo=hobbit   /livros?limit=5&offset=0
app.get('/livros', async (req, res) => {
    try {
        let filtro = {};
        if (req.query.categoriaId) {
            filtro.categoriaId = req.query.categoriaId;
        }
        if (req.query.titulo) {
            filtro.titulo = { [Op.like]: '%' + req.query.titulo + '%' };
        }
        const livros = await db.Livro.findAll({
            where: filtro,
            include: [{ model: db.Categoria, as: 'categoria' }, { model: db.Autor, as: 'autor' }],
            order: [['titulo', 'ASC']],
            limit: req.query.limit,
            offset: req.query.offset
        });
        res.json(livros);
    } catch (err) {
        tratarErro(res, 'GET /livros', err);
    }
});

app.put('/livros/:id', async (req, res) => {
    try {
        if (!req.body.titulo || !req.body.categoriaId || !req.body.autorId) {
            return res.status(400).json({ erro: 'Informe titulo, categoriaId e autorId' });
        }
        await db.Livro.update(req.body, { where: { id: req.params.id } });
        res.json({ mensagem: 'Livro atualizado' });
    } catch (err) {
        tratarErro(res, 'PUT /livros/:id', err);
    }
});

app.delete('/livros/:id', async (req, res) => {
    try {
        await db.Livro.destroy({ where: { id: req.params.id } });
        res.json({ mensagem: 'Livro excluido' });
    } catch (err) {
        tratarErro(res, 'DELETE /livros/:id', err);
    }
});

// ================= AVALIACOES (MongoDB) =================

app.post('/avaliacoes/:livroId', async (req, res) => {
    try {
        if (!req.body.usuario || !req.body.nota) {
            return res.status(400).json({ erro: 'Informe usuario e nota' });
        }
        let doc = await Avaliacao.findOne({ livroId: req.params.livroId });
        if (!doc) {
            doc = new Avaliacao({ livroId: req.params.livroId, avaliacoes: [] });
        }
        doc.avaliacoes.push(req.body);
        await doc.save();
        res.json(doc);
    } catch (err) {
        tratarErro(res, 'POST /avaliacoes/:livroId', err);
    }
});

app.get('/avaliacoes/:livroId', async (req, res) => {
    try {
        const doc = await Avaliacao.findOne({ livroId: req.params.livroId });
        res.json(doc);
    } catch (err) {
        tratarErro(res, 'GET /avaliacoes/:livroId', err);
    }
});

// :indice e a posicao da avaliacao na lista (0, 1, 2...)
app.put('/avaliacoes/:livroId/:indice', async (req, res) => {
    try {
        if (!req.body.usuario || !req.body.nota) {
            return res.status(400).json({ erro: 'Informe usuario e nota' });
        }
        const doc = await Avaliacao.findOne({ livroId: req.params.livroId });
        doc.avaliacoes[req.params.indice] = req.body;
        await doc.save();
        res.json(doc);
    } catch (err) {
        tratarErro(res, 'PUT /avaliacoes/:livroId/:indice', err);
    }
});

app.delete('/avaliacoes/:livroId/:indice', async (req, res) => {
    try {
        const doc = await Avaliacao.findOne({ livroId: req.params.livroId });
        doc.avaliacoes.splice(req.params.indice, 1);
        await doc.save();
        res.json(doc);
    } catch (err) {
        tratarErro(res, 'DELETE /avaliacoes/:livroId/:indice', err);
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});