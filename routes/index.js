const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const Article = require('../models/Article');
const path = require("path");
const {verify2FaEnabled, authenticateToken} = require("../middlewares/auth");

/////BLOG////

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/blogs/private', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/private.html'));
});

// Route pour rendre la page des détails d'un blog
router.get('/blog/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/blogDetail.html'));
});


// Route pour obtenir un blog par son ID avec ses articles
router.get('/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id, {
            include: [{
                model: Article,
                as: 'Articles'
            }]
        });
        if (blog) {
            res.json(blog);
        } else {
            res.status(404).json({error: 'Blog non trouvé'});
        }
    } catch (err) {
        console.error('Erreur lors de la récupération du blog :', err);
        res.status(500).json({error: 'Erreur lors de la récupération du blog.'});
    }
});


// Route pour obtenir tous les blogs
router.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.findAll({where: {isPublic: 1}});
        res.json(blogs);
    } catch (err) {
        console.error('Erreur lors de la récupération des blogs :', err);
        res.status(500).json({error: 'Erreur lors de la récupération des blogs.'});
    }
});

router.get('/blogsPrivate', authenticateToken, async (req, res) => {
    try {
        const blogs = await Blog.findAll({where: {isPublic: 0}});
        res.json(blogs);
    } catch (err) {
        console.error('Erreur lors de la récupération des blogs :', err);
        res.status(500).json({error: 'Erreur lors de la récupération des blogs.'});
    }
});

// Route pour générer un nouveau blog
router.post('/blog/create', verify2FaEnabled, async (req, res) => {
    try {
        const newBlog = await Blog.create({
            title: `Blog généré à ${new Date().toLocaleString()}`,
            isPublic: true
        });
        res.json(newBlog);
    } catch (err) {
        console.error('Erreur lors de la génération du blog :', err);
        res.status(500).json({error: 'Erreur lors de la génération du blog.'});
    }
});

module.exports = router;