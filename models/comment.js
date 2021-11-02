const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    topic: {
        type: String,
        required: true,
    },
    text:{
        type: String
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
})

const autoPopulateComment = function(next){
    this.populate('comments');
    next();
}

commentSchema
    .pre('findOne',autoPopulateComment)
    .pre('find', autoPopulateComment)
    .pre('findById', autoPopulateComment)
    
module.exports = mongoose.model('Comment',commentSchema)