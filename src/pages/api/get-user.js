import {initiateApp, isUserLoggedIn} from '../../api-utils';

const app = initiateApp();

app.use((req, res) => {

    const isLoggedIn = isUserLoggedIn(req);

    res.setHeader('Content-Type', 'application/json');

    res.status(200).json({
        status: isLoggedIn,
        user: req.user
    });

  });

  export default app;