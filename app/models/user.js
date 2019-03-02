var mongoose = require('mongoose');

var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

//creating schema
var UserSchema = new Schema({
    name : { type: String, required: true, useNewUrlParser: true},
    username: { type: String, required: true, useNewUrlParser: true, indexes: { unique: true}},
    password: { type: String, required: true, useNewUrlParser: true, select: false}
});

//hashing password
UserSchema.pre('save', function(next){

    var user = this;

    if(!user.isModified('password')) return next();
    
    bcrypt.hash(user.password, null, null, (err, hash)=> {
        if(err) return next(err);

        user.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function(password) {
    var user = this;
    if (user.password !== null){
        //to check a password
        return bcrypt.compareSync(password, user.password);
    }
    else{
        return false;
    }
};

const User = module.exports = mongoose.model('User', UserSchema);