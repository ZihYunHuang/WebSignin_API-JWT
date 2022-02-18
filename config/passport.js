const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const prisma = require('../services/prismaClientService');

module.exports = (passport) => {
    let opts = {};
    opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken('bearer');
    opts.secretOrKey = process.env.PASSPORT_SECRET;

    passport.use(
        new jwtStrategy(opts, async function (jwt_paload, done) {
            try {
                done(null, 1);
            } catch (error) {
                return done(err, false);
            }
        })
    )
}