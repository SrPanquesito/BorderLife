const { JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const express = require('express');
const {body} = require('express-validator');
const isAuth = require('../middleware/is-auth');

const User = require('../models/user');
const userController = require('../controllers/userInteraction');

const router = express.Router();

router.put('/signup', isAuth, [
    body('name').trim().not().isEmpty(),
    body('name')
        .custom((value, {req}) => {
            return User.findOne({name: value}).then(userDoc => {
                if(userDoc) {
                    return Promise.reject('User already exists!');
                }
            });
        })
    ],
    userController.signup
);

// If we want to generate another jwt
// router.get('/gen-token', (req, res, next) => {
//     const token = jwt.sign(
//         {
//             info: "Access token for requests to the BorderLife MongoDB"
//         },
//         JWT_SECRET,
//         { expiresIn: '30d' }
//     );
//     res.status(200).json({ token: token });
// });

module.exports = router;