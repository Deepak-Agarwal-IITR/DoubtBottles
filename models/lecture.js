const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Comment = require('./comment');

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

lectureSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        doc.comments.forEach(async (comment)=>{
            await Comment.findByIdAndDelete(comment);
        })
    }
})
module.exports = mongoose.model('Lecture',lectureSchema)