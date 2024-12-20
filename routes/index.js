const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const Article = require('../models/Article');
const {verify2FaEnabled, authenticateToken} = require("../middlewares/auth");
const {verify} = require("jsonwebtoken");

/////BLOG////

router.get('/blogs', async (req, res) => {
    const blogs = await Blog.findAll({where: {isPublic: 1}});
    res.render('blogs/index', {blogs});
});

router.get('/blogs/private', authenticateToken ,async (req, res) => {
    const blogs = await Blog.findAll({ where: { isPublic: 0 } });
    res.render('blogs/privates', { blogs });
});

router.get('/blog/:id', async (req, res) => {
    const blogId = req.params.id;
    const blog = await Blog.findByPk(blogId, {
        include: [{
            model: Article,
            as: 'Articles'
        }]
    });
    //Pour bloquer l'accés aux détails d'un blog privé si on n'est pas connécté
    if (blog.isPublic === false) {
        const token = req.headers['authorization'] || req.cookies['token'];
        if (!token) {
            return res.status(401).send("Vous devez être connecté pour accéder à ce blog.");
        }
        try {
            req.user = verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(403).send("Non autorisé");
        }
    }
    res.render('blogs/show', { blog });
});

router.get("/personal-space", authenticateToken,verify2FaEnabled, async (req, res) => {
    const blogs = await Blog.findAll({
        where: { userId: req.user.id },
        include: [{ model: Article, as: 'Articles' }]
    });
    res.render('profile/personal-space', { blogs });
});


// Route pour créer un blog
router.post('/blog', authenticateToken, verify2FaEnabled, async (req, res) => {
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
router.delete('/blog/:id', authenticateToken, verify2FaEnabled, async (req, res) => {
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
router.put('/blog/:id', authenticateToken, verify2FaEnabled, async (req, res) => {
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
router.post('/blog/:id/article', authenticateToken, verify2FaEnabled, async (req, res) => {
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
router.delete('/article/:id', authenticateToken, verify2FaEnabled, async (req, res) => {
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
router.put('/article/:id', authenticateToken, verify2FaEnabled, async (req, res) => {
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

module.exports = router;