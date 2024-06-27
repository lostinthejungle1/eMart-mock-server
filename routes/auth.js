const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = 'liangliang';  // Use a secure, environment-specific key

module.exports = function(server, db) {
    // Register a new user
    server.post('/register', (req, res) => {
        const { username, password } = req.body;
        const existingUser = db.get('users').find({ username }).value();
        if (existingUser) {
            return res.status(409).json({ message: '用户名已存在' });
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = db.get('users').insert({
            username,
            password: hashedPassword
        }).write();
        res.status(201).json({ message: 'User created' });
    });

    // Login user and create a JWT
    server.post('/login', (req, res) => {
        console.log('logging in...')
        const { username, password } = req.body;
        const user = db.get('users').find({ username }).value();
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }
        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
            res.status(200).json({ message: '登录成功', token });
        } else {
            res.status(401).json({ message: '用户密码信息不一致' });
        }
    });

    server.post('/verify-token', (req, res) => {
        const token = req.body.token;
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }
        try {
            const decoded = jwt.verify(token, secretKey);
            return res.status(200).json({ message: 'Token is valid', user: decoded });
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    });
};
