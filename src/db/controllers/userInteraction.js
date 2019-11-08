const {validationResult} = require('express-validator');

const User = require('../models/user');
const conexion = require('../../conexion');

exports.getUsers = (req, res, next) => {
    User.find()
        .then(users => {
            res.status(200).json({message: 'Fetched users succesfully.', listUsers: users});
        })
        .catch(err => {
            const error = new Error('Couldnt retrieve users.');
            error.status = 422;
            error.data = err.array();
            throw error;
        });
};

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const user = new User({
        messenger_id: req.body.messenger_id,
        webscrapping_count: req.body.webscrapping_count,
        name: req.body.name,
        status: req.body.status
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



exports.signupFB = async (sender) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()){
    //     const error = new Error('Validation failed.');
    //     error.statusCode = 422;
    //     error.data = errors.array();
    //     throw error;
    // }
    var fetchStatus, json;
    await User.findOne({messenger_id:sender})
        .then(async userFound => {
            if(userFound) {
                // Empieza a contar, gordito
                fetchStatus = 'USER FOUND'; 
                userFound.webscrapping_count += 1;
                return await userFound.save();
            } else {
                // Crea al usuario con el messenger_id = sender (El ID del usuario que esta enviando mensaje)
                fetchStatus = 'USER CREATED';
                var userInfo = await conexion.getProfileInfo(sender);
                console.log(userInfo);
                const userNew = new User({
                    messenger_id: sender,
                    webscrapping_count: 1,
                    first_name: userInfo.first_name,
                    last_name: userInfo.last_name,
                    profile_pic: userInfo.profile_pic,
                    // locale: userInfo.locale,
                    // timezone: userInfo.timezone,
                    // gender: userInfo.gender,
                    status: 'server'
                });
                return await userNew.save();
            }
        })
        .then(user => {
            json = {status: fetchStatus, user: user};
        })
        .catch(err => {
            throw err;
        });

    return json;
};