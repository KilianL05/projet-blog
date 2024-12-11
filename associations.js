// associations.js
const Article = require('./models/Article');
const Blog = require('./models/Blog');
const User = require("./models/User");

Blog.hasMany(Article, {
    foreignKey: {
        name: 'blogId',
        allowNull: false
    },
    onDelete: 'CASCADE' // This ensures that deleting a blog also deletes associated articles
});

Article.belongsTo(Blog, {
    foreignKey: {
        name: 'blogId',
        allowNull: false
    }
});

Blog.belongsTo(User, { foreignKey: 'userId', as: 'User' });

User.hasMany(Blog, { foreignKey: 'userId', as: 'Blogs' });