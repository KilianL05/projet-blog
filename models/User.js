// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Blog = require('./Blog'); // Ensure Blog is imported after sequelize is defined

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    twoFactorEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    twoFactorSecret: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = User;