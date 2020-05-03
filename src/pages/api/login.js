import connect from '../../route-middleware';
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
    console.log("\n\nvalidate: ", username, password);
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


const startUserSession = (req, user) => {

    req.login(user, function (err) {
      if(err) {
        console.log(err);
        return;
      }
    });
  
}

export const onUserAuthentication = (req, res) => (error, session, info) => {
    
    if (error) {
      return res.status(401).send(error);
    }
    
    if (!session) {
      return res.status(401).send(info);
    } 
  
    startUserSession(req, session);

    res.status(200).send(session);
}


const app = connect();

app.use(passport.initialize());

app.use(passport.session());

passport.use(new LocalStrategy(validateUserCredentials));

passport.serializeUser(serializeSessionUser);

passport.deserializeUser(deserialiseSessionUser);

app.use((req, res) => {

    if (req.method !== 'POST') {
        res.status(400).send("Only HTTP POST is supported.");
    }

    passport.authenticate('local', onUserAuthentication(req, res))(req, res);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ name: 'Next.js' });
  });

  export default app;