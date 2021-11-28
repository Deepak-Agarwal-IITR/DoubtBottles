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
    lectures: [{
        type: Schema.Types.ObjectId,
        ref: 'Lecture'
    }],
    description: {
        type:String
    },
    teacher: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    }

})

module.exports = mongoose.model('Course',courseSchema)