const express = require('express');
const router = express.Router();

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Registration Page
router.get('/registration', (req, res) => res.render('registration'));

// Registration Handle
router.post('/registration', (req, res) => {
    const { username, email, password, password2  } = req.body;
    let errors = [];
});

module.exports = router;
