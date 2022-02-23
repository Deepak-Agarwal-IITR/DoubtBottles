const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Lecture = require('./lecture');
  
const pollSchema = new Schema({
    question:{
        type:String
    },
    options:[{
        type:String
    }],
    createdOn:{
        type: Date
    },
    endTime:{
        type: Date
    }
});
    
const announcementSchema = new Schema({
    description:{
        type: String
    },
    createdOn:{
        type: Date
    }
});

const courseSchema = new Schema({
    name:{
        type: String,
        required: true
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
    },
    users:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    announcements:[announcementSchema],
    polls:[pollSchema]
})

courseSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        doc.lectures.forEach(async (lecture)=>{
            await Lecture.findByIdAndDelete(lecture);
        })
    }
})

module.exports = mongoose.model('Course',courseSchema)  