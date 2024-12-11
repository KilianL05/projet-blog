// models/Article.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./User');

const federated_credentials  = sequelize.define('federated_credentials', {
    provider: {
        type: DataTypes.STRING,
        allowNull: false
    },
    providerId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }

});


module.exports = federated_credentials;