// app.js
const express = require('express');
const app = express();
const sequelize = require('./sequelize');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/authentifaction');
const {join} = require("node:path");
require('./associations');
require('./models/User');
require('./models/Blog');
require('./models/Article');


// Middleware pour servir des fichiers statiques depuis le dossier "public"
app.use(express.static(join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRoutes);

sequelize.sync({ force: false }).then(() => {
    console.log('Tables synchronisées.');
    app.listen(3000, () => {
        console.log('Serveur démarré sur le port 3000 : http://localhost:3000');
    });
}).catch(err => console.error('Erreur de synchronisation :', err));

module.exports = app;