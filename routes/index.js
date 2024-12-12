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

router.get("/personal-space" , verify2FaEnabled, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/personal-space.html'));
});


//Route pour obtenir les blogs de l'utilisateur
router.get('/blogs/user', authenticateToken, async (req, res) => {
    try {
        const blogs = await Blog.findAll({where: {userId: req.user.id}});
        res.json(blogs);
    } catch (err) {
        console.error('Erreur lors de la récupération des blogs :', err);
        res.status(500).json({error: 'Erreur lors de la récupération des blogs.'});
    }
});

// Route pour créer un blog
router.post('/blog', authenticateToken, async (req, res) => {
    try {
        const blog = await Blog.create({
            title: req.body.title,
            isPublic: req.body.isPublic,
            userId: req.user.id
        });
        res.status(201).json(blog);
    } catch (err) {
        console.error('Erreur lors de la création du blog :', err);
        res.status(500).json({error: 'Erreur lors de la création du blog.'});
    }
});

// Route pour supprimer un blog
router.delete('/blog/:id', async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (blog) {
            await blog.destroy();
            res.json({message: 'Blog supprimé avec succès!'});
        } else {
            res.status(404).json({error: 'Blog non trouvé'});
        }
    } catch (err) {
        console.error('Erreur lors de la suppression du blog :', err);
        res.status(500).json({error: 'Erreur lors de la suppression du blog.'});
    }
});

// Route pour mettre à jour un blog
router.put('/blog/:id', async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (blog) {
            await blog.update(req.body);
            res.json(blog);
        } else {
            res.status(404).json({error: 'Blog non trouvé'});
        }
    } catch (err) {
        console.error('Erreur lors de la mise à jour du blog :', err);
        res.status(500).json({error: 'Erreur lors de la mise à jour du blog.'});
    }
});

// Route pour créer un article
router.post('/blog/:id/article', async (req, res) => {
    try {
        const article = await Article.create({
            title: req.body.title,
            content: req.body.content,
            blogId: req.params.id
        });
        res.status(201).json(article);
    } catch (err) {
        console.error('Erreur lors de la création de l\'article :', err);
        res.status(500).json({error: 'Erreur lors de la création de l\'article.'});
    }
});

// Route pour supprimer un article
router.delete('/article/:id', async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        if (article) {
            await article.destroy();
            res.json({message: 'Article supprimé avec succès!'});
        } else {
            res.status(404).json({error: 'Article non trouvé'});
        }
    } catch (err) {
        console.error('Erreur lors de la suppression de l\'article :', err);
        res.status(500).json({error: 'Erreur lors de la suppression de l\'article.'});
    }
});

// Route pour mettre à jour un article
router.put('/article/:id', async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        if (article) {
            await article.update(req.body);
            res.json(article);
        } else {
            res.status(404).json({error: 'Article non trouvé'});
        }
    } catch (err) {
        console.error('Erreur lors de la mise à jour de l\'article :', err);
        res.status(500).json({error: 'Erreur lors de la mise à jour de l\'article.'});
    }
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

module.exports = router;