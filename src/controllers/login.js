var crypto = require("../helpers/crypto");
var express = require("express");
var router = express.Router();

var User = require("../models/User");

var database = require('../app').database;

router.post('/', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    var retrievedUser = User.getByEmail(email);

    /* User not found */
    if (!retrievedUser) {
        res.status(400).end();
    }

    var hashedPassword = crypto.sha512(password, retrievedUser.salt);
   
    /* Correct password */
    if (retrievedUser.Password === hashedPassword) {
        /* User still needs to confirm account */
        if (!retrievedUser.Confirmed) {
            res.redirect('/register/confirm?email=' + email);
        } else {
            console.log("succesful login");
            var user = User.summarize(retrievedUser);
            req.session.user = user;
            res.status(200).end();
        }
    } else {
        // Passwords did not match
        res.status(402).end();
    }
}).get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../views/login.html'));
});

module.exports = router;