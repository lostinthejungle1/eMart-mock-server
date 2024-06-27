const verifyToken = require('../middleware/auth');

module.exports = (server, db) => {
    server.get('/categories', verifyToken, (req, res) => {
        try {
            const categories = db.get('categories').value();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}