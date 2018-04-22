'use strict';

const Strategy = require('passport-local').Strategy;
const User = require('../../core/models/User');


const LocalStrategy = new Strategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ where: { email } });
        if (user) {
            if (user.password !== password) {
                return done(null, false);
            }
            return done(null, user);
        }
        return done(null, false);
    } catch (err) {
        return done(err);
    }
});

module.exports = LocalStrategy;