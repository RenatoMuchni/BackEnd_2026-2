module.exports = (sequelize, Sequelize) => {
    const Autor = sequelize.define('autor', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        nome: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, { freezeTableName: true });   // mantem o nome da tabela em portugues
    return Autor;
};