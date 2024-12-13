const express = require('express');
const path = require("path");
const {hash, compare} = require("bcrypt");
const {generateToken, authenticateToken, verify2FaEnabled} = require("../middlewares/auth");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');
const User = require('../models/User');
const Session = require('../models/Session');
const FederatedCredentials = require('../models/FederatedCredentials');
const {authenticator} = require("otplib"); // Correct import

const routerAuth = express.Router();

routerAuth.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/auth/login.html'));
});

routerAuth.get('/login/federated/google', passport.authenticate('google'));

routerAuth.get('/oauth2/redirect/google', passport.authenticate('google', {
    failureRedirect: '/login'
}), async (req, res) => {
    const token = generateToken(req.user);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

    await Session.create({userId: req.user.id, token, expiresAt});

    res.cookie('jwt', token, {secure: true, maxAge: 3600000}); // 1 hour
    res.redirect('/');
});

passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: '/oauth2/redirect/google',
    scope: ['profile', 'email']
}, async function verify(issuer, profile, cb) {
    try {
        const row = await FederatedCredentials.findOne({where: {provider: issuer, providerId: profile.id}});
        if (!row) {
            const user = await User.create({email: profile.emails[0].value});
            await FederatedCredentials.create({userId: user.id, provider: issuer, providerId: profile.id});
            return cb(null, user);
        } else {
            const user = await User.findOne({where: {id: row.userId}});
            if (!user) {
                return cb(null, false);
            }
            return cb(null, user);
        }
    } catch (err) {
        return cb(err, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

routerAuth.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/auth/register.html'));
});

routerAuth.post('/register', async (req, res) => {
    try {
        const {username, password} = req.body;
        const hashedPassword = await hash(password, 10);
        await User.create({
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

        const validPassword = await compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({error: 'Nom d’utilisateur ou mot de passe incorrect.'});
        }

        const token = generateToken(user);
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await Session.create({userId: user.id, token, expiresAt});

        res.cookie('jwt', token, {secure: true});
        res.json({token: token});
    } catch (err) {
        res.status(500).json({error: 'Une erreur s’est produite lors de l’authentification.' + err});
    }
});

routerAuth.post('/logout', authenticateToken, async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    await Session.destroy({where: {token}});

    res.clearCookie('jwt');
    res.json({message: 'Déconnexion réussie'});
});

routerAuth.post('/logout-all', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const code = req.body.code;

    if (!code) {
        return res.status(400).json({error: 'Code de vérification manquant'});
    }

    const user = await User.findByPk(userId);
    if (!user || !user.twoFactorSecret) {
        return res.status(404).json({error: 'Utilisateur ou secret 2FA introuvable'});
    }

    const isValid = authenticator.verify({token: code, secret: user.twoFactorSecret});

    if (!isValid) {
        return res.status(401).json({error: 'Code de vérification invalide'});
    }

    await User.update({twoFactorEnabled: false, twoFactorSecret: null}, {where: {id: userId}});
    await Session.destroy({where: {userId}});

    res.clearCookie('jwt');
    res.json({message: 'Déconnexion de tous les appareils réussie'});
});

module.exports = routerAuth;