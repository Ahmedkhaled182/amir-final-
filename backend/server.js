const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const db_access = require('./db.js');
const db = db_access.db;

const server = express();
const port = 555;
const secret_key = 'DdsdsdKKFDDFDdvfddvxvc4dsdvdsvdb'; 

server.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
server.use(express.json());
server.use(cookieParser());
server.use(express.static('public'));

const generateToken = (id) => {
    return jwt.sign({ id }, secret_key, { expiresIn: '1h' });
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).send('Unauthorized');

    jwt.verify(token, secret_key, (err, details) => {
        if (err) return res.status(403).send('Invalid or expired token');
        req.userDetails = details;
        next();
    });
};

// User Login Route
server.post('/user/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM USERS WHERE EMAIL = ?', [email], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving user data.' });
        }
        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }

        bcrypt.compare(password, row.PASSWORD, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: 'Error comparing passwords.' });
            }
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = generateToken(row.ID);
            res.cookie('authToken', token, {
                httpOnly: true,
                sameSite: 'none',
                expiresIn: '1h'
            });

            return res.status(200).json({ id: row.ID, name: row.NAME });
        });
    });
});

// User Registration Route
server.post('/user/register', (req, res) => {
    const { name, email, password } = req.body;

    db.get('SELECT * FROM USERS WHERE EMAIL = ?', [email], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Error checking email.' });
        }
        if (row) {
            return res.status(400).json({ error: 'Email already in use.' });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ error: 'Error hashing password' });
            }

            db.run('INSERT INTO USERS (NAME, EMAIL, PASSWORD) VALUES (?, ?, ?)', [name, email, hashedPassword], (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error registering user.' });
                }
                return res.status(200).json({ message: 'Registration successful' });
            });
        });
    });
});

// Protected Route: Checkout (Requires Authentication)
server.post('/orders/checkout', (req, res) => {
    const { userId, cartItems, totalPrice, address, phone } = req.body;

    if (!userId || !cartItems || !totalPrice || !address || !phone) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    let errors = [];
    let success = true;

    cartItems.forEach(cartItem => {
        db.run(
            'INSERT INTO ORDERS (USER_ID, PRODUCT_ID, QUANTITY, TOTAL_PRICE, ADDRESS, PHONE) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, cartItem.productId, cartItem.quantity, totalPrice, address, phone],
            (err) => {
                if (err) {
                    console.error('Error inserting order:', err);
                    errors.push(err);
                    success = false;
                }
            }
        );
    });

    if (!success) {
        return res.status(500).json({ error: 'Failed to place order due to errors.' });
    }

    res.status(200).json({ message: 'Order placed successfully!' });
});

server.get('/products/:brand', (req, res) => {
    const brand = req.params.brand;
    db.all('SELECT * FROM PRODUCTS WHERE BRAND = ?', [brand], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching products.' });
        }
        res.status(200).json(rows);
    });
});


server.listen(port, () => {
    console.log('Server started at port ${port}');
});