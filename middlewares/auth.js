require('dotenv').config();
const jwt = require('jsonwebtoken');
const Session = require('../models/Session');

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'] || req.cookies['token'];

    if (!authHeader || authHeader === 'null') {
        return res.status(401).send("Vous devez être connecté");
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);

        const session = await Session.findOne({ where: { token: token, userId: user.id } });

        if (!session || session.expiresAt < new Date()) {
            return res.status(401).send("Session expirée ou invalide.");
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).send("Non autorisé.");
    }
}

function verify2FaEnabled(req, res, next) {
    const authHeader = req.headers['authorization'] || req.cookies['token'];
    if (!authHeader || authHeader === 'null') {
        return res.status(401).send("Vous devez être connecté");
    }
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (!user.twoFactorEnabled) {
        return res.status(403).send("L'authentification à deux facteurs n'est pas activée.");
    }
    next();
}

function generateToken(user) {
    return jwt.sign({ id: user.id, email: user.email, twoFactorEnabled: user.twoFactorEnabled }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
}

module.exports = { authenticateToken, generateToken, verify2FaEnabled };