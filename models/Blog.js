// models/Blog.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./User'); // Ensure User is imported after sequelize is defined

const Blog = sequelize.define('Blog', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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



module.exports = Blog;