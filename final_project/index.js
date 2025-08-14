const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const JWTSecretKey = require('./router/auth_users.js').JWTSecretKey;
const sessionSecretKey = "fingerprint_customer";


const app = express();

app.use(express.json());

app.use("/customer",session({secret:sessionSecretKey,resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){

    // Check if user is authenticated
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken']; // Access Token

        // Verify JWT token for user authentication
        jwt.verify(token, JWTSecretKey, (err, user) => {
            if (!err) {
                req.user = user; // Set authenticated user data on the request object
                next(); // Proceed to the next middleware
            } else {
                // If verification fails, return the error response and do nothing else
                return res.status(403).json({ message: `User not authenticated: ${err}` });
            }
        });
    } else {
        // If no access token is found, return the error response and do nothing else
        return res.status(403).json({ message: "User not logged in" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
