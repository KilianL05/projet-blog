require('dotenv').config();
const jwt = require('jsonwebtoken');
const Session = require('../models/Session');

async function authenticateToken(req, res, next) {
    console.log(req.headers);

    const authHeader = req.headers['authorization'];

    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);

        const session = await Session.findOne({ where: { token: token, userId: user.id } });
        console.log("coucou")
        console.log(session);

        if (!session || session.expiresAt < new Date()) {
            return res.sendStatus(401);
        }

        req.user = user;
        next();
    } catch (err) {
        return res.sendStatus(403);
    }
}

function verify2FaEnabled(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (!user.twoFactorEnabled) return res.sendStatus(403);
    next();
}

function generateToken(user) {
    return jwt.sign({ id: user.id, email: user.email, twoFactorEnabled: user.twoFactorEnabled }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
}

module.exports = { authenticateToken, generateToken, verify2FaEnabled };