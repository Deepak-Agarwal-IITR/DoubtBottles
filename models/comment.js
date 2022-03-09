const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { cloudinary } = require("../cloudinary");

const commentSchema = new Schema({
    topic: {
        type: String,
    },
    text:{
        type: String,
        required: true,
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    likedBy:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikedBy:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdOn:{
        type: Date
    },
    images:[{
        url: String,
        filename: String
    }]
})

const autoPopulateComment = function(next){
    this.populate('comments').populate('user');
    next();
}

commentSchema
    .pre('findOne',autoPopulateComment)
    .pre('find', autoPopulateComment)
    .pre('findById', autoPopulateComment)

    
commentSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        doc.comments.forEach(async (comment)=>{
            await this.model.findByIdAndDelete(comment);         
        })
        for(let image of doc.images){
            await cloudinary.uploader.destroy(image.filename);
        }
    }
})
module.exports = mongoose.model('Comment',commentSchema)