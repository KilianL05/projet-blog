const express = require('express');
const router = express.Router();
const path = require("path");
const { hash, compare } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { generateToken, authenticateToken } = require("../middlewares/auth");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');
const User = require('../models/User');
const FederatedCredentials = require('../models/FederatedCredentials'); // Correct import

const routerAuth = express.Router();

routerAuth.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

routerAuth.get('/login/federated/google', passport.authenticate('google'));

routerAuth.get('/oauth2/redirect/google', passport.authenticate('google', {
    failureRedirect: '/login'
}), (req, res) => {
    // Generate JWT token
    const token = generateToken(req.user);
    res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 3600000 }); // 1 hour
    res.redirect('/');
});

passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: '/oauth2/redirect/google',
    scope: ['profile', 'email']
}, async function verify(issuer, profile, cb) {
    try {
        const row = await FederatedCredentials.findOne({ where: { provider: issuer, providerId: profile.id } });
        if (!row) {
            const user = await User.create({ email: profile.emails[0].value });
            await FederatedCredentials.create({ userId: user.id, provider: issuer, providerId: profile.id });
            return cb(null, user);
        } else {
            const user = await User.findOne({ where: { id: row.userId } });
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
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

routerAuth.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await hash(password, 10);

        const newUser = await User.create({
            email: username,
            password: hashedPassword
        });
        res.status(201).json({ message: 'Utilisateur créé avec succès!' });
    } catch (err) {
        res.status(500).json({ error: 'Une erreur s’est produite lors de l’inscription.' + err });
    }
});

routerAuth.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { email: username } });
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