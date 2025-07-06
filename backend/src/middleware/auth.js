const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../database/schema');
require('dotenv').config({ path: '../config.env' });

const JWT_SECRET = process.env.JWT_SECRET;

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Role-based authorization middleware
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
};

// Login function
const login = (username, password) => {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, username],
            (err, user) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!user) {
                    reject(new Error('User not found'));
                    return;
                }

                const isValidPassword = bcrypt.compareSync(password, user.password);
                if (!isValidPassword) {
                    reject(new Error('Invalid password'));
                    return;
                }

                const token = jwt.sign(
                    {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                resolve({
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                });
            }
        );
    });
};

// Register function (admin only)
const registerUser = (userData) => {
    return new Promise((resolve, reject) => {
        const { username, email, password, role = 'employee' } = userData;
        const { v4: uuidv4 } = require('uuid');

        const hashedPassword = bcrypt.hashSync(password, 10);
        const userId = uuidv4();

        db.run(
            'INSERT INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [userId, username, email, hashedPassword, role],
            function (err) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve({
                    id: userId,
                    username,
                    email,
                    role
                });
            }
        );
    });
};

module.exports = {
    authenticateToken,
    authorizeRole,
    login,
    registerUser
}; 