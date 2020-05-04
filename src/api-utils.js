import connect from './route-middleware';
import session from './cookie-session';
import passport from 'passport';

var LocalStrategy = require('passport-local').Strategy;

/**
 * When login is successful return session info
 * as second parameter of done function
 * 
 * @param {string} username 
 * @param {string} password 
 * @param {function} done 
 */
const validateUserCredentials = (username, password, done) => {
    done(null, {
        token: "1234tokens"
    });
}

/**
 * Serialize user info JSON object into JSON string
 * 
 * @param {JSON} user 
 * @param {function} done 
 */
const serializeSessionUser = (user, done) => {

    done(null, JSON.stringify(user));
}

/**
 * De-serialize user info JSON string into object
 * 
 * @param {String} user
 * @param {function} done 
 */
const deserialiseSessionUser = (user, done) => {

    done(null, JSON.parse(user));
}

export const initiateApp = () => {
    
    const app = connect();

    // initialize express-session to allow us track the logged-in user across sessions.
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    app.use(session({
    name: 'private-session-app', //cookie name
    keys: ['private', 'session'], //used to sign and verify cookie
    maxAge: 20 * 60 * 60 * 1000, // 20 hours
    cookie: {
        httpOnly: true,
        expires: expiryDate
    }
    }));

    app.use(passport.initialize());

    app.use(passport.session());

    passport.use(new LocalStrategy(validateUserCredentials));

    passport.serializeUser(serializeSessionUser);

    passport.deserializeUser(deserialiseSessionUser);

    return app;
}


export const isUserLoggedIn = (req) => {
    
    return req.isAuthenticated();
}