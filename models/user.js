const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    name: {
        type: String
    },
    notifications:[{
        type: Schema.Types.ObjectId,
        ref: 'Notification'
    }]
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema)