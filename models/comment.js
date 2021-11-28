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
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const autoPopulateComment = function(next){
    this.populate('comments').populate('user');
    next();
}

commentSchema
    .pre('findOne',autoPopulateComment)
    .pre('find', autoPopulateComment)
    .pre('findById', autoPopulateComment)
    
module.exports = mongoose.model('Comment',commentSchema)