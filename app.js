// app.js
require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./sequelize');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const twoFactorRoutes = require('./routes/2fa');
const { join } = require("node:path");
require('./associations');
require('./models/User');
require('./models/Blog');
require('./models/Article');
require('./models/Session');
const session = require("express-session");

// Middleware pour servir des fichiers statiques depuis le dossier "public"
app.use(express.static(join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// Configure session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

// Use routes
app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/', twoFactorRoutes);

sequelize.sync({ force: false }).then(() => {
    console.log('Tables synchronisées.');
    app.listen(3000, () => {
        console.log('Serveur démarré sur le port 3000 : http://localhost:3000');
    });
}).catch(err => console.error('Erreur de synchronisation :', err));

module.exports = app;