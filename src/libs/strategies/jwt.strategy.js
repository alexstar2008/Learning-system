'use strict';

const Strategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const { auth: { secret } } = require('../../../config');
const User = require('../../core/models/User');

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('Bearer');
jwtOptions.secretOrKey = secret;

const JwtStrategy = new Strategy(jwtOptions, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        return done(null, user);
    } catch (err) {
        return done(err);
    }
});

module.exports = JwtStrategy;