// models/Session.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Session = sequelize.define('Session', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

module.exports = Session;