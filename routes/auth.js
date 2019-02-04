const express = require('express');
const passwordValidator = require('password-validator');
const router  = express.Router();
const pwdValidator = new passwordValidator;
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User');

//Password validation rules
pwdValidator
        .has().digits()
        .has().not().spaces();

//Registration page
router.get('/register', (req, res) => res.render('register', { layout : 'auth' }));

//Register user
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;

    //Validation
    let errors = [];
    if (!name || !email || !password || !password2) {
        errors.push({ message : 'All input fields are required' });
    }

    if (password !== password2) {
        errors.push({ message : 'Passwords do not match' });
    }

    //Validate password
    var pwdErrors = pwdValidator.validate(password, { list : true });

    if (pwdErrors.indexOf('min')) {
        errors.push({ message : 'Minimum length allowed for password is 8 characters' });
    }

    if (pwdErrors.indexOf('uppercase')) {
        errors.push({ message : 'Your password must contain an uppercase letter' });
    }

    if (pwdErrors.indexOf('lowercase')) {
        errors.push({ message : 'Your password must constain a lowercase letter' });
    }

    //If any errors
    if (errors.length > 0) {
        res.render('register', { 
            layout : 'auth',
            errors,
            name,
            email,
            password,
            password2
        });

    } else { //Validation has passed
        //Check if user exists
        User.findOne({ email : email })
            .then(user => {
                if (user) {
                    //User exists
                    errors.push({ message : 'A user exists with the email provided.' });
                    res.render('register', { 
                        layout : 'auth',
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({ 
                        name,
                        email,
                        password
                     });

                     //Hash password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => { 
                            if (err) throw err;
                            newUser.password = hash;

                            //Save user
                            newUser.save()
                            .then( user => {
                                req.flash('success_message', 'Registration successful. You can now log in.');
                                res.redirect('/auth/login');
                            })
                            .catch(err);

                        })
                    );
                }
            });
    }
});

//Login page
router.get('/login', (req, res) => res.render('login', { layout : 'auth' }));

//Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect : '/index',
        failureRedirect : '/auth/login',
        failureFlash : true
    })(req, res, next);
});

//Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_message', 'You have been logged out');
    res.redirect('/auth/login');
});

module.exports = router;