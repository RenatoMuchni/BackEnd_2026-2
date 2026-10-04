module.exports = (sequelize, Sequelize) => {

    const Livro = sequelize.define('livro', {

        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },

        titulo: {
            type: Sequelize.STRING,
            allowNull: false
        },

        anoPublicacao: {
            type: Sequelize.INTEGER,
            allowNull: true
        }

    }, { freezeTableName: true });

    return Livro;
};