var express = require('express');
var router = express.Router();

var User = require('../models/user');

// Handle incoming GET requests to /api/auth/user
router.get('/user', (req, res, next) => {
    User.find()
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: "KO: user not found."
        })
    });
});

router.delete('/user', (req, res, next) => {
    User.remove({ email: req.body.email })
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: "KO: user not found."
        })
    });
});

module.exports = router;