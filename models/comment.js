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

module.exports = mongoose.model('Comment',commentSchema)