const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../app/models/user');

passport.use(
    new localStrategy((username, password, done)=>{
    User.findOne({username : username},
        (err, user)=>{
            if(err) return done(err);

            else if (!user) return done(null, false, {msg: 'user not found'});

            else if (!user.comparePassword(password))
                return done(null, false, {msg : 'wrong password'});

            else return done(null, user);
        })
}))