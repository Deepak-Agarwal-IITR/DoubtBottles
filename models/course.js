const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    code:{
        type:String
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    description: {
        type:String
    }

})

module.exports = mongoose.model('Course',courseSchema)