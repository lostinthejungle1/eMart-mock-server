const bcrypt = require('bcrypt');
const verifyToken = require('../middleware/auth');

module.exports = (server, db) => {
    // Get all users
    server.get('/users', verifyToken, (req, res) => {
        const users = db.get('users').value();
        res.json(users);
    });

    // Get a single user by id
    server.get('/users/:id',verifyToken, (req, res) => {
        const user = db.get('users').find({ id: parseInt(req.params.id) }).value();
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    });

    // Create a new user
    server.post('/users', verifyToken,(req, res) => {
        const { username, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = db.get('users').insert({
            username,
            password: hashedPassword
        }).write();
        res.status(201).json(newUser);
    });

    // Update an existing user
    server.put('/users/:id',verifyToken, (req, res) => {
        const { username, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);
        const updatedUser = db.get('users')
                              .find({ id: parseInt(req.params.id) })
                              .assign({ username, password: hashedPassword })
                              .write();
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).send('User not found');
        }
    });

    // Delete a user
    server.delete('/users/:id',verifyToken, (req, res) => {
        db.get('users').remove({ id: parseInt(req.params.id) }).write();
        res.status(204).send();
    });

};
