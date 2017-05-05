const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

module.exports.register = function (req, res) {
    console.log('registering a user');

    const username = req.body.username;
    const name = req.body.name || null;
    const password = req.body.password;

    User.create({
        username: username,
        name: name,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    },
        function (err, user) {
        if(err){
            console.log(err);
            res
                .status(400)
                .json(err);
            return;
        }

        console.log('user created', user);

        res
            .status(201)
            .json(user);
    });
};

module.exports.login = function (req, res) {
    console.log('loggin in a user');

    const username = req.body.username;
    const password = req.body.password;

    User.findOne({
        username: username
    })
        .exec(function (err, user) {
            if(err){
                console.log(err);
                res
                    .status(400)
                    .json(err);
                return;
            }

            if(bcrypt.compareSync(password, user.password)){
                const token = jwt.sign({username: user.username}, 's3cr3t', {expiresIn: 3600});

                console.log('User found ', user);
                res
                    .status(200)
                    .json({success: true, token: token});
                return;
            }

            console.log('Passwords do not match');
            res
                .status(401)
                .json({message: 'Unauthorized'});
        });
};

module.exports.authenticate = function (req, res, next) {
    const headerExists = req.headers.authorization;
    if(headerExists){
        const token = req.headers.authorization.split(' ')[1]; // Authorization: Bearer xxx
        jwt.verify(token, 's3cr3t', function (error, decoded) {
            if(error){
                console.log(error);
                res
                    .status(401)
                    .json({message: 'Unauthorized'});
                return;
            }

            req.user = decoded.username;
            next();
        });
    }
    else{
        res
            .status(403)
            .json({message: 'No token provided'});
    }
};