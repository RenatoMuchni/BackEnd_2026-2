//Configuração conexão Postgres
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'biblioteca',
    'postgres',
    '1234',
    {
        host: 'localhost',
        dialect: 'postgres',
        logging: false,
        timezone: '-03:00'
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Categoria = require('../models/Categoria.js')(sequelize, Sequelize);
db.Autor = require('../models/Autor.js')(sequelize, Sequelize);
db.Livro = require('../models/Livro.js')(sequelize, Sequelize);

// as: nome com que categoria e autor aparecem dentro do livro nas consultas
db.Categoria.hasMany(db.Livro, { foreignKey: 'categoriaId' });
db.Livro.belongsTo(db.Categoria, { foreignKey: 'categoriaId', as: 'categoria' });

db.Autor.hasMany(db.Livro, { foreignKey: 'autorId' });
db.Livro.belongsTo(db.Autor, { foreignKey: 'autorId', as: 'autor' });

module.exports = db;
