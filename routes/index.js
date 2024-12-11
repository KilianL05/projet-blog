const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require('../models/User');
const Article = require('../models/Article');
const path = require("path");
const {hash, compare} = require("bcrypt");
const {sign} = require("jsonwebtoken");
const {where} = require("sequelize");
const {generateToken, authenticateToken} = require("../middlewares/auth");


/////AUTHENTIFICATION////

router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
})

router.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
})
// Inscription
router.post('/register', async (req, res) => {
    try {
        const {username, password} = req.body;
        const hashedPassword = await hash(password, 10);

        const newUser = await User.create({
            email: username,
            password: hashedPassword
        });
        res.status(201).json({message: 'Utilisateur créé avec succès!'});
    } catch (err) {
        res.status(500).json({error: 'Une erreur s’est produite lors de l’inscription.' + err});
    }
});


// Authentification
router.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({where: {email: username}});
        if (!user) {
            return res.status(400).json({error: 'Nom d’utilisateur ou mot de passe incorrect.'});
        }

        // Validate the password
        const validPassword = await compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({error: 'Nom d’utilisateur ou mot de passe incorrect.'});
        }
        const token = generateToken(user);

        res.json({token: token});
    } catch (err) {
        res.status(500).json({error: 'Une erreur s’est produite lors de l’authentification.' + err});
    }
});

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

module.exports = router;

// Route pour générer un nouveau blog
router.post('/blog/create', authenticateToken, async (req, res) => {
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