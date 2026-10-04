const API = '';


// ================= NAVEGAÇÃO =================

function mostrarSecao(secao) {
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });

    document.getElementById(secao).style.display = 'block';

    if (secao === 'livros') carregarLivros();
    if (secao === 'autores') carregarAutores();
    if (secao === 'categorias') carregarCategorias();
}


// ================= AUTORES =================

async function carregarAutores() {
    const resposta = await fetch(API + '/autores');
    const autores = await resposta.json();

    const lista = document.getElementById('listaAutores');

    lista.innerHTML = '';

    autores.forEach(autor => {
        lista.innerHTML += `
            <div class="item">
                <h3>${autor.nome}</h3>
                <p>ID: ${autor.id}</p>

                <button class="editar"
                    onclick="editarAutor(${autor.id}, '${autor.nome}')">
                    Editar
                </button>

                <button class="excluir"
                    onclick="excluirAutor(${autor.id})">
                    Excluir
                </button>
            </div>
        `;
    });

    carregarAutoresNoSelect();
}


async function carregarAutoresNoSelect() {
    const resposta = await fetch(API + '/autores');
    const autores = await resposta.json();

    const select = document.getElementById('livroAutor');

    select.innerHTML = '<option value="">Selecione um autor</option>';

    autores.forEach(autor => {
        select.innerHTML += `
            <option value="${autor.id}">
                ${autor.nome}
            </option>
        `;
    });
}


async function salvarAutor() {
    const id = document.getElementById('autorId').value;
    const nome = document.getElementById('autorNome').value;

    if (!nome) {
        alert('Informe o nome do autor');
        return;
    }

    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `/autores/${id}` : '/autores';

    await fetch(API + url, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome })
    });

    document.getElementById('autorId').value = '';
    document.getElementById('autorNome').value = '';

    carregarAutores();
}


function editarAutor(id, nome) {
    document.getElementById('autorId').value = id;
    document.getElementById('autorNome').value = nome;
}


async function excluirAutor(id) {
    if (!confirm('Deseja excluir este autor?')) return;

    await fetch(API + `/autores/${id}`, {
        method: 'DELETE'
    });

    carregarAutores();
}


// ================= CATEGORIAS =================

async function carregarCategorias() {
    const resposta = await fetch(API + '/categorias');
    const categorias = await resposta.json();

    const lista = document.getElementById('listaCategorias');

    lista.innerHTML = '';

    categorias.forEach(categoria => {
        lista.innerHTML += `
            <div class="item">
                <h3>${categoria.nome}</h3>
                <p>ID: ${categoria.id}</p>

                <button class="editar"
                    onclick="editarCategoria(${categoria.id}, '${categoria.nome}')">
                    Editar
                </button>

                <button class="excluir"
                    onclick="excluirCategoria(${categoria.id})">
                    Excluir
                </button>
            </div>
        `;
    });

    carregarCategoriasNoSelect();
}


async function carregarCategoriasNoSelect() {
    const resposta = await fetch(API + '/categorias');
    const categorias = await resposta.json();

    const select = document.getElementById('livroCategoria');

    select.innerHTML = '<option value="">Selecione uma categoria</option>';

    categorias.forEach(categoria => {
        select.innerHTML += `
            <option value="${categoria.id}">
                ${categoria.nome}
            </option>
        `;
    });
}


async function salvarCategoria() {
    const id = document.getElementById('categoriaId').value;
    const nome = document.getElementById('categoriaNome').value;

    if (!nome) {
        alert('Informe o nome da categoria');
        return;
    }

    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `/categorias/${id}` : '/categorias';

    await fetch(API + url, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome })
    });

    document.getElementById('categoriaId').value = '';
    document.getElementById('categoriaNome').value = '';

    carregarCategorias();
}


function editarCategoria(id, nome) {
    document.getElementById('categoriaId').value = id;
    document.getElementById('categoriaNome').value = nome;
}


async function excluirCategoria(id) {
    if (!confirm('Deseja excluir esta categoria?')) return;

    await fetch(API + `/categorias/${id}`, {
        method: 'DELETE'
    });

    carregarCategorias();
}


// ================= LIVROS =================

async function carregarLivros() {
    const resposta = await fetch(API + '/livros');
    const livros = await resposta.json();

    const lista = document.getElementById('listaLivros');

    lista.innerHTML = '';

    livros.forEach(livro => {
        lista.innerHTML += `
            <div class="item">
                <h3>${livro.titulo}</h3>

                <p>ID: ${livro.id}</p>
                <p>Ano: ${livro.anoPublicacao || 'Não informado'}</p>
                <p>Categoria: ${livro.categoria ? livro.categoria.nome : 'Não encontrada'}</p>
                <p>Autor: ${livro.autor ? livro.autor.nome : 'Não encontrado'}</p>

                <button class="editar"
                    onclick="editarLivro(${livro.id}, '${livro.titulo}', ${livro.anoPublicacao || 0}, ${livro.categoriaId}, ${livro.autorId})">
                    Editar
                </button>

                <button class="excluir"
                    onclick="excluirLivro(${livro.id})">
                    Excluir
                </button>

                <button onclick="verAvaliacoes(${livro.id})">
                    Avaliações
                </button>
            </div>
        `;
    });
}


async function salvarLivro() {
    const id = document.getElementById('livroId').value;
    const titulo = document.getElementById('livroTitulo').value;
    const anoPublicacao = document.getElementById('livroAno').value;
    const categoriaId = document.getElementById('livroCategoria').value;
    const autorId = document.getElementById('livroAutor').value;

    if (!titulo || !categoriaId || !autorId) {
        alert('Preencha título, categoria e autor');
        return;
    }

    const dados = {
        titulo: titulo,
        anoPublicacao: anoPublicacao,
        categoriaId: categoriaId,
        autorId: autorId
    };

    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `/livros/${id}` : '/livros';

    await fetch(API + url, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    });

    document.getElementById('livroId').value = '';
    document.getElementById('livroTitulo').value = '';
    document.getElementById('livroAno').value = '';
    document.getElementById('livroCategoria').value = '';
    document.getElementById('livroAutor').value = '';

    carregarLivros();
}


function editarLivro(id, titulo, ano, categoriaId, autorId) {
    document.getElementById('livroId').value = id;
    document.getElementById('livroTitulo').value = titulo;
    document.getElementById('livroAno').value = ano;
    document.getElementById('livroCategoria').value = categoriaId;
    document.getElementById('livroAutor').value = autorId;
}


async function excluirLivro(id) {
    if (!confirm('Deseja excluir este livro?')) return;

    await fetch(API + `/livros/${id}`, {
        method: 'DELETE'
    });

    carregarLivros();
}


// ================= AVALIAÇÕES =================

async function salvarAvaliacao() {
    const livroId = document.getElementById('avaliacaoLivroId').value;
    const usuario = document.getElementById('avaliacaoUsuario').value;
    const nota = document.getElementById('avaliacaoNota').value;
    const comentario = document.getElementById('avaliacaoComentario').value;

    if (!livroId || !usuario || !nota) {
        alert('Preencha livro, usuário e nota');
        return;
    }

    await fetch(API + `/avaliacoes/${livroId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usuario: usuario,
            nota: Number(nota),
            comentario: comentario
        })
    });

    document.getElementById('avaliacaoUsuario').value = '';
    document.getElementById('avaliacaoNota').value = '';
    document.getElementById('avaliacaoComentario').value = '';

    carregarAvaliacoes(livroId);
}


async function carregarAvaliacoes(livroId) {
    const resposta = await fetch(API + `/avaliacoes/${livroId}`);
    const avaliacao = await resposta.json();

    const lista = document.getElementById('listaAvaliacoes');

    lista.innerHTML = '';

    if (!avaliacao || !avaliacao.avaliacoes) {
        lista.innerHTML = '<p>Nenhuma avaliação encontrada.</p>';
        return;
    }

    avaliacao.avaliacoes.forEach((item, indice) => {

        lista.innerHTML += `
            <div class="item">
                <h3>${item.usuario}</h3>

                <p>Nota: ${item.nota}/5</p>
                <p>Comentário: ${item.comentario || 'Sem comentário'}</p>

                <button class="editar"
                    onclick="editarAvaliacao(${livroId}, ${indice})">
                    Editar
                </button>

                <button class="excluir"
                    onclick="excluirAvaliacao(${livroId}, ${indice})">
                    Excluir
                </button>
            </div>
        `;
    });
}


function verAvaliacoes(livroId) {
    mostrarSecao('avaliacoes');

    document.getElementById('avaliacaoLivroId').value = livroId;

    carregarAvaliacoes(livroId);
}


async function editarAvaliacao(livroId, indice) {

    const resposta = await fetch(API + `/avaliacoes/${livroId}`);
    const avaliacao = await resposta.json();

    const item = avaliacao.avaliacoes[indice];

    document.getElementById('avaliacaoLivroId').value = livroId;
    document.getElementById('avaliacaoUsuario').value = item.usuario;
    document.getElementById('avaliacaoNota').value = item.nota;
    document.getElementById('avaliacaoComentario').value = item.comentario || '';

    const botao = document.querySelector('#avaliacoes .formulario button');

    botao.textContent = 'Atualizar avaliação';

    botao.onclick = async function () {

        await fetch(API + `/avaliacoes/${livroId}/${indice}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: document.getElementById('avaliacaoUsuario').value,
                nota: Number(document.getElementById('avaliacaoNota').value),
                comentario: document.getElementById('avaliacaoComentario').value
            })
        });

        botao.textContent = 'Adicionar avaliação';

        document.getElementById('avaliacaoUsuario').value = '';
        document.getElementById('avaliacaoNota').value = '';
        document.getElementById('avaliacaoComentario').value = '';

        botao.onclick = salvarAvaliacao;

        carregarAvaliacoes(livroId);
    };
}


async function excluirAvaliacao(livroId, indice) {

    if (!confirm('Deseja excluir esta avaliação?')) return;

    await fetch(API + `/avaliacoes/${livroId}/${indice}`, {
        method: 'DELETE'
    });

    carregarAvaliacoes(livroId);
}

carregarAutores();
carregarCategorias();
carregarLivros();