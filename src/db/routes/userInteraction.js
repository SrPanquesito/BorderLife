const express = require('express');
const {body} = require('express-validator');
const isAuth = require('../middleware/is-auth');

const User = require('../models/user');
const userController = require('../controllers/userInteraction');

const router = express.Router();

router.get('/', isAuth, userController.getUsers);

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

module.exports = router;