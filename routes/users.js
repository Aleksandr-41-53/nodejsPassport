const express = require('express');
const router = express.Router();
const beCry = require('bcryptjs');

// User model
const User = require('../models/User');

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Registration Page
router.get('/registration', (req, res) => res.render('registration'));

// Registration Handle
router.post('/registration', (req, res) => {
    const { username, email, password, password2  } = req.body;
    let errors = [];

    // Check required fields
    if (!username || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check password match
    if (password === password2) {
        // Check pass length
        if (password.length < 6) {
            errors.push({ msg: 'Password should be at least 6 characters' });
        }
    } else {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length <= 0) {
        // Validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ msg: 'Email already exists' });
                    res.render('registration', {
                        errors,
                        username,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        username,
                        email,
                        password
                    });

                    // Hash Password
                    beCry.genSalt(10, (err, salt) => {
                        beCry.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            // Set password to hashed
                            newUser.password = hash;
                            // Save new user
                            newUser.save()
                                .then(user => {
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        });
                    });
                }
            })
    } else {
        res.render('registration', {
            errors,
            username,
            email,
            password,
            password2
        });
    }


});

module.exports = router;
