const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load User model
const User = require('../models/User');

module.exports = function (passport) {
    passport.use(new LocalStrategy({ usernameField : 'email' } ,
        function(email, password, done) {
            //Find user
            User.findOne({ email : email }, function (err, user) {
                if (err) { return done(err); }
                if (!user) { //User doesn't exist
                    return done(null, false, { message: 'Incorrect username.' });
                }

                //Compare passwords
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) { return done(err); }
                    if (!isMatch) { //Passwords don't matchs
                        return done(null, false, { message: 'Incorrect password.' });
                    }

                    return done(null, user);
                });
                
            });
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}