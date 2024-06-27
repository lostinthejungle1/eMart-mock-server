const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    console.log('in verify token middleware')
    const token = req.headers['authorization']?.split(' ')[1]; // Assumes a Bearer token
    if (!token) return res.status(401).json({ message: 'No token provided.' });
    jwt.verify(token, 'liangliang', (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;
