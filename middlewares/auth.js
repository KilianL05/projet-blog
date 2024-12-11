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


function generateToken(user) {
    return jwt.sign({ id: user.id, twoFactorEnabled: user.twoFactorEnabled }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
}

module.exports = { authenticateToken, generateToken };