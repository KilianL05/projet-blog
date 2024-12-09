// models/Blog.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Blog = sequelize.define('Blog', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Blog;