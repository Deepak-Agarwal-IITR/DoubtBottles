const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const lectureSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    description: {
        type:String
    }

})

module.exports = mongoose.model('Lecture',lectureSchema)