const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Setup session middleware
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Middleware to authenticate for customer/auth/*
app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session && req.session.authorization) {
        const token = req.session.authorization.accessToken;

        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user; // attach decoded user info
                next();
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

// Mount routers
app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
