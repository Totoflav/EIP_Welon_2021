// AuthController.js
var express = require('express');
var router = express.Router();

var User = require('../models/user');
var verifyToken = require('./verifyToken');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

// Return information of connected user
router.get('/me', verifyToken, function(req, res) {
    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err)
            return res.status(500).send("There was a problem finding the user.");
        if (!user)
            return res.status(404).send("No user found.");
        
        res.status(200).send(user);
    });
});

// Allow to register to the API
router.post('/register', function(req, res) {
  
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    
    User.create({
      username : req.body.email,
      password : hashedPassword
    },
    function (err, user) {
      if (err) {
        return res.status(500).send("There was a problem registering the user.")
      }
      // create a token
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).send({ auth: true, token: token });
    }); 
});

// Allow to login to the API
router.post('/login', function(req, res) {
    User.findOne({ username: req.body.email }, function (err, user) {
      if (err)
        return res.status(500).send('Error on the server.');
      if (!user)
        return res.status(404).send('No user found.');
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid)
        return res.status(401).send({ auth: false, token: null });
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).send({ auth: true, token: token });
    });
});

// Allow to logout to the API
router.get('/logout', verifyToken, function(req, res) {
    res.status(200).send({ auth: false, token: undefined });
});

module.exports = router;