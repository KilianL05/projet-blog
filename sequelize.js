// sequelize.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('blog', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate()
    .then(() => console.log('Connexion établie à la base de données MySQL.'))
    .catch(err => console.error('Erreur de connexion à la base de données :', err));

module.exports = sequelize;