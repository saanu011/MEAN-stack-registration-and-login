var config = require('../../config');

var superSecret = config.secretKey;

var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;

//importing schema
var User = require('../models/user');


var jsonwebtoken = require('jsonwebtoken');


//retreiving users
router.get('/users', (req, res, next)=>{
    User.find((err, users)=>{
        res.json(users);
    });
});

//adding users
router.post('/signup', (req, res, next)=>{

    
    var newUser = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    });

    User.findOne({username : req.body.username}, function(err, user){
        if (err) return err;

        else if (user) return res.json({ msg: 'Username already taken'});

        else{
            //saving new user to database
            newUser.save((err)=>{
            
                if (err){
                    console.log(err);
                }
                else{
                    res.json({ msg : 'User has been added'});
                }
            });
        }
    });
    
});

/** Function.on('error', (err) => {
    console.log(err.message)
 });*/

//logging in
router.post('/login', (req, res)=>{
    
    User.findOne({
        username: req.body.username
    }).select('password').exec( function(err, user) {
        if (err) {
            throw err;
        }

        if (!user) {
            res.send({ msg: 'user not found'});
        }
        else if (user){
            let validPassword = user.comparePassword(req.body.password);

            if (!validPassword) {
                res.send({ msg: "invalid password" });
            } else{
                // creating a token
                    var token = jsonwebtoken.sign(
                        {
                            _id: user._id,
                            name: user.name,
                            username: user.username
                        }, 
                        superSecret, 
                        { expiresIn: 1440 }
                    );
                res.send({token: 'JWT' + token});
            }
        }
    });
});

//updating existing user
router.put('/:id', (req, res, next)=>{
    if (!ObjectId.isValid(req.params.id))
        return res.json({ msg : 'user is not defined with id : ' + req.params.id});

    var user = {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    }

    User.findByIdAndUpdate(req.params.id, { $set : user}, { new : true}, (err, doc)=>{
        if (err) {
            console.log('Error in update: ' + err);
        }
        else{
            console.log(res.send(doc));
        }
    });
});

//deleting user
router.delete('/:id', (req, res, next)=>{
    if (!ObjectId.isValid(req.params.id))
        return res.json({ msg : 'user is not defined with id : ' + req.params.id});
    User.deleteOne({_id: req.params.id},(err, result)=>{
        if(err){
            res.json(err);
        }
        else{
            res.json(result);
        }
    });
});

module.exports = router;