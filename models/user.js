const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    name: {
        type: String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema)