// routes/2fa.js
const express = require('express');
const {authenticator} = require('otplib');
const qrcode = require('qrcode');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {authenticateToken, generateToken} = require("../middlewares/auth");
const path = require("path");

const router2fa = express.Router();
router2fa.get('/2fa', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/2fa.html'));
});
router2fa.get('/qrcode', authenticateToken, async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;


    const payload = jwt.decode(token);
    const username = payload.email;

    const service = 'WebApp Auth';
    const authenticatorSecret = authenticator.generateSecret();

    await User.update({twoFactorSecret: authenticatorSecret}, {where: {email: username}});

    const keyURI = authenticator.keyuri(username, service, authenticatorSecret);
    qrcode.toDataURL(keyURI, (err, imageSrc) => {
        if (err) {
            res.status(500).send('Oups, une erreur est survenue');
        }
        res.send(`<img src="${imageSrc}" alt='qrcode'><br><a href="/verify-2fa?username=${username}">Verify 2FA</a>`);
    });
});

router2fa.get('/verify-2fa', (req, res) => {
    const username = req.query.username;
    res.send(`
        <form method="POST" action="/verify-2fa">
            <input type="hidden" name="username" value="${username}">
            <label for="token">Code secret TOTP</label>
            <input type="number" name="token" id="token">
            <input type="submit" value="Valider">
        </form>
    `);
});

router2fa.post('/verify-2fa', async (req, res) => {
    const username = req.body.username;
    const token = req.body.token;

    let user = await User.findOne({where: {email: username}});
    const authenticatorSecret = user.twoFactorSecret;

    const isValid = authenticator.verify({token, secret: authenticatorSecret});

    if (isValid) {
        await User.update({twoFactorEnabled: true}, {where: {email: username}});
        user = await User.findOne({where: {email: username}});

        const newToken = generateToken(user);

        res.cookie('jwt', newToken, {secure: true});
        res.redirect('/');
    } else {
        res.send("Mauvais code");
    }
});

module.exports = router2fa;