const jwt = require('jsonwebtoken');

function verifyToken(req) {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header) return null;
    const parts = header.split(' ');
    if (parts.length !== 2) return null;
    const token = parts[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        return payload;
    } catch (err) {
        return null;
    }
}

module.exports = { verifyToken };
