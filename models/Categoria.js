module.exports = (sequelize, Sequelize) => {
    const Categoria = sequelize.define('categoria', {
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
    return Categoria;
};