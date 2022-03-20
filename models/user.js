const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    name: {
        type: String
    },
    numberOfNotifications:{
        type:Number,
        default:0
    }
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema)