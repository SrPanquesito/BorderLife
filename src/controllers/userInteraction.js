const {validationResult} = require('express-validator');

const User = require('../models/user');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const name = req.body.name;
    const user = new User({
        name: name
    });
    user.save()
        .then(user => {
            res.status(201).json({message: 'User created!', mongo_userId: user._id});
        })
        .catch(error => {
            if(!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};