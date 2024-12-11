// sequelize.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'mysql',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

sequelize.authenticate()
    .then(() => console.log('Connexion établie à la base de données MySQL.'))
    .catch(err => console.error('Erreur de connexion à la base de données :', err));

module.exports = sequelize;