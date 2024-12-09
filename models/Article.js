// models/Article.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Blog = require('./Blog');

const Article = sequelize.define('Article', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    blogId: {
        type: DataTypes.INTEGER,
        references: {
            model: Blog,
            key: 'id'
        }
    }
});

// Assurez-vous que vous avez cet alias correctement
Blog.hasMany(Article, { foreignKey: 'blogId', as: 'Articles' });
Article.belongsTo(Blog, { foreignKey: 'blogId', as: 'Blog' });

module.exports = Article;