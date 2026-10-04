# Projeto 1 - Biblioteca (Catálogo de Livros e Avaliações)

**Disciplina:** Programação Web Back-End (AS63A) - UTFPR

## Integrantes


* Bruno Rocha de Souza - 2819449
* Bruno Samuel de Camargo Cardoso - 2102587
* Fabio Kaynan Ignácio Ramos - 2779684
* Renato Muchni Teixeira - 2269244

## Temática

Sistema de biblioteca com escopo limitado ao **catálogo de livros** e às **avaliações dos leitores**.

O sistema permite cadastrar categorias, autores e livros. Cada livro pode receber avaliações com nota de 1 a 5 e comentário.

O projeto possui uma API desenvolvida em **Node.js e Express**, utilizando **PostgreSQL com Sequelize** para os dados do catálogo e **MongoDB com Mongoose** para as avaliações.

Também possui uma interface web simples desenvolvida com **HTML, CSS e JavaScript**, que permite utilizar as principais funcionalidades do sistema.

## Bancos de dados utilizados

| Banco      | Biblioteca | O que guarda             |
| ---------- | ---------- | ------------------------ |
| PostgreSQL | Sequelize  | Categoria, Autor e Livro |
| MongoDB    | Mongoose   | Avaliações dos livros    |

## Modelagem

### PostgreSQL

**Categoria**

* id
* nome (obrigatório)

**Autor**

* id
* nome (obrigatório)

**Livro**

* id
* titulo (obrigatório)
* anoPublicacao
* categoriaId (FK)
* autorId (FK)

### Relacionamentos

* **Categoria 1:N Livro** — uma categoria pode possuir vários livros.
* **Autor 1:N Livro** — um autor pode possuir vários livros.

O relacionamento entre Categoria/Autor e Livro é realizado no PostgreSQL por meio de chaves estrangeiras.

### MongoDB

As avaliações são armazenadas em um documento por livro, contendo uma lista de avaliações:

```json
{
  "livroId": 1,
  "avaliacoes": [
    {
      "usuario": "Ana",
      "nota": 5,
      "comentario": "Excelente",
      "data": "..."
    },
    {
      "usuario": "Carlos",
      "nota": 4,
      "comentario": "Muito bom",
      "data": "..."
    }
  ]
}
```

### PostgreSQL

Categoria, Autor e Livro foram armazenados no PostgreSQL porque possuem uma estrutura mais fixa e possuem relacionamentos entre si.

O banco relacional permite utilizar chaves estrangeiras para representar esses relacionamentos.

### MongoDB

As avaliações foram armazenadas no MongoDB porque cada livro pode possuir uma quantidade variável de avaliações.

As avaliações ficam agrupadas dentro do documento do livro, facilitando a consulta das avaliações relacionadas a determinado livro.

## Front-end

O projeto possui uma interface web desenvolvida com:

* HTML
* CSS
* JavaScript

A interface permite:

* cadastrar livros;
* consultar livros;
* editar livros;
* excluir livros;
* cadastrar autores;
* consultar autores;
* editar autores;
* excluir autores;
* cadastrar categorias;
* consultar categorias;
* editar categorias;
* excluir categorias;
* cadastrar avaliações;
* consultar avaliações;
* editar avaliações;
* excluir avaliações.

O front-end utiliza as rotas da API desenvolvida em Express.

Para acessar a interface, após iniciar o servidor, basta abrir:

```text
http://localhost:3000
```

## Como instalar e executar

### Pré-requisitos

É necessário possuir instalado:

* Node.js
* PostgreSQL
* MongoDB

### 1. Criar o banco PostgreSQL

No PostgreSQL:

```sql
CREATE DATABASE biblioteca;
```

### 2. Configurar o PostgreSQL

Conferir usuário, senha, banco e demais configurações no arquivo:

```text
config/db_sequelize.js
```

### 3. Configurar o MongoDB

Conferir a string de conexão no arquivo:

```text
config/db_mongoose.js
```

Por padrão, o projeto utiliza:

```text
mongodb://localhost:27017/biblioteca
```

### 4. Instalar as dependências

Dentro da pasta do projeto:

```bash
npm install
```

### 5. Executar o projeto

```bash
node app.js
```

O servidor será iniciado em:

```text
http://localhost:3000
```

As tabelas do PostgreSQL são criadas/sincronizadas automaticamente pelo:

```js
sequelize.sync()
```

As tabelas utilizadas são:

```text
categoria
autor
livro
```

### 6. Utilizar o sistema

É possível utilizar a interface web acessando:

```text
http://localhost:3000
```

As rotas também podem ser testadas utilizando o Thunder Client, extensão do VS Code, ou o Postman.

Nas requisições POST e PUT, o corpo deve ser enviado em formato JSON.

## Funcionalidades e rotas

### Categorias - PostgreSQL

**POST /categorias**

Cadastra uma categoria.

Exemplo:

```json
{
  "nome": "Fantasia"
}
```

**GET /categorias**

Lista todas as categorias.

**PUT /categorias/:id**

Atualiza uma categoria.

Exemplo:

```json
{
  "nome": "Ficção"
}
```

**DELETE /categorias/:id**

Exclui uma categoria.

### Autores - PostgreSQL

**POST /autores**

Cadastra um autor.

Exemplo:

```json
{
  "nome": "J. K. Rowling"
}
```

**GET /autores**

Lista todos os autores.

**PUT /autores/:id**

Atualiza um autor.

**DELETE /autores/:id**

Exclui um autor.

### Livros - PostgreSQL

**POST /livros**

Cadastra um livro.

Exemplo:

```json
{
  "titulo": "O Hobbit",
  "anoPublicacao": 1937,
  "categoriaId": 1,
  "autorId": 1
}
```

**GET /livros**

Lista os livros, incluindo suas respectivas categorias e autores.

Os livros são apresentados em ordem alfabética pelo título.

**GET /livros?categoriaId=1**

Filtra os livros por categoria.

**GET /livros?titulo=hobbit**

Busca livros por parte do título.

**GET /livros?limit=5&offset=0**

Realiza paginação dos resultados.

**PUT /livros/:id**

Atualiza um livro.

**DELETE /livros/:id**

Exclui um livro.

### Avaliações - MongoDB

**POST /avaliacoes/:livroId**

Adiciona uma avaliação para um livro.

Exemplo:

```json
{
  "usuario": "Ana",
  "nota": 5,
  "comentario": "Ótimo livro"
}
```

**GET /avaliacoes/:livroId**

Consulta as avaliações de determinado livro.

**PUT /avaliacoes/:livroId/:indice**

Altera uma avaliação pela posição dentro da lista.

Exemplo:

```text
PUT /avaliacoes/1/0
```

Nesse exemplo, será alterada a primeira avaliação do livro de ID 1.

**DELETE /avaliacoes/:livroId/:indice**

Remove uma avaliação pela posição dentro da lista.

## Validação, erros e log

As rotas de cadastro e alteração verificam os campos obrigatórios.

Quando um campo obrigatório não é informado, a API retorna:

```text
400 Bad Request
```

Os models também possuem validações.

No Sequelize são utilizados recursos como:

```js
allowNull: false
```

No Mongoose, as avaliações possuem validações como:

```js
required: true
min: 1
max: 5
```

A nota das avaliações, portanto, deve estar entre **1 e 5**.

As rotas utilizam `try/catch` para tratamento de erros.

Em caso de erro inesperado, a API retorna:

```text
500 Internal Server Error
```

e o erro é registrado em:

```text
logs/errors.log
```

O registro dos erros é realizado pela classe `Logger`, localizada em:

```text
logs/logger.js
```

## Programação Orientada a Objetos

O projeto utiliza uma classe `Logger` para o registro dos erros.

A classe possui:

* construtor;
* atributo para armazenar o caminho do arquivo;
* método para registrar os erros.

Arquivo:

```text
logs/logger.js
```

## Estrutura do projeto

```text
biblioteca/
│
├── app.js
├── package.json
├── README.md
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── config/
│   ├── db_sequelize.js
│   └── db_mongoose.js
│
├── models/
│   ├── Categoria.js
│   ├── Autor.js
│   ├── Livro.js
│   └── Avaliacao.js
│
└── logs/
    ├── logger.js
    └── errors.log
```