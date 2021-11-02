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

const autoPopulateComment = function(next){
    this.populate('comments');
    next();
}

lectureSchema
    .pre('findOne',autoPopulateComment)
    .pre('find', autoPopulateComment)
    .pre('findById', autoPopulateComment)

module.exports = mongoose.model('Lecture',lectureSchema)