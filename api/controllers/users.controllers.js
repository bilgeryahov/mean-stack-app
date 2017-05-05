const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt-nodejs');

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
                console.log('User found ', user);
                res
                    .status(200)
                    .json(user);
                return;
            }

            console.log('Passwords do not match');
            res
                .status(401)
                .json({'message': 'Unauthorized'});
        });
};