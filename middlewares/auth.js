require('dotenv').config();

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    console.log(req.headers);

    const authHeader = req.headers['authorization'];

    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function verify2FaEnabled(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log(user);
    if (!user.twoFactorEnabled) return res.sendStatus(403);
    next();
}


function generateToken(user) {
    return jwt.sign({ id: user.id, email: user.email, twoFactorEnabled: user.twoFactorEnabled }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
}

module.exports = { authenticateToken, generateToken, verify2FaEnabled };