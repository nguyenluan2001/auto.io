const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy

const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} = process.env
console.log("🚀 ===== GOOGLE_CLIENT_SECRET:", GOOGLE_CLIENT_SECRET);
console.log("🚀 ===== GOOGLE_CLIENT_ID:", GOOGLE_CLIENT_ID);

passport.use(new GoogleStrategy({
    clientID:GOOGLE_CLIENT_ID,
    clientSecret:GOOGLE_CLIENT_SECRET,
    callbackURL:'http://localhost:3000/api/auth/google/callback',
    passReqToCallback:true
}, (request, accessToken, refreshToken, profile, done) => done(null, profile)))

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))