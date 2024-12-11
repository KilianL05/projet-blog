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

const routerAuth = express.Router();

routerAuth.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
})

routerAuth.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
})
// Inscription
routerAuth.post('/register', async (req, res) => {
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

routerAuth.post('/login', async (req, res) => {
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

module.exports = routerAuth ;