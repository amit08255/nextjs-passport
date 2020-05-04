import {initiateApp} from '../../api-utils';
import passport from 'passport';


const startUserSession = (req, res, user) => {

    req.login(user, function (err) {
      if(err) {
        console.log("\n\nLogin error: ", err);
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
  
    startUserSession(req, res, session);

    res.status(200).send(session);
}

const app = initiateApp();

app.use((req, res) => {

    if (req.method !== 'POST') {
        res.status(400).send("Only HTTP POST is supported.");
    }

    passport.authenticate('local', onUserAuthentication(req, res))(req, res);
  });

  export default app;