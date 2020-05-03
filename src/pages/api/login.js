import connect from '../../route-middleware';
import passport from 'passport';
import session from '../../cookie-session';
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
export const serializeSessionUser = (user, done) => {

    done(null, JSON.stringify(user));
}

/**
 * De-serialize user info JSON string into object
 * 
 * @param {String} user
 * @param {function} done 
 */
export const deserialiseSessionUser = (user, done) => {

    done(null, JSON.parse(user));
}


const startUserSession = (req, res, user) => {

    req.login(user, function (err) {
      if(err) {
        console.log("\n\nLogin error: ", err);
        return;
      }
    });
  
}

export const onUserAuthentication = (req, res) => (error, session, info) => {

  console.log("\n\ncookies: ", req);
  console.log("\n\n\ncookie res: ", res);
    
    if (error) {
      return res.status(401).send(error);
    }
    
    if (!session) {
      return res.status(401).send(info);
    } 
  
    startUserSession(req, res, session);

    res.status(200).send(session);
}


// initialize express-session to allow us track the logged-in user across sessions.
const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour


const app = connect();

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


passport.use(new LocalStrategy(validateUserCredentials));

passport.serializeUser(serializeSessionUser);

passport.deserializeUser(deserialiseSessionUser);

app.use((req, res) => {

    if (req.method !== 'POST') {
        res.status(400).send("Only HTTP POST is supported.");
    }

    passport.authenticate('local', onUserAuthentication(req, res))(req, res);
  });

  export default app;