const mongoose = require('mongoose');
const Course = require('../models/course')
const Lecture = require('../models/lecture')
const Comment = require('../models/lecture')
mongoose.connect('mongodb://localhost:27017/doubtapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected")
})


const seedDB = async () => {
    await Comment.deleteMany({});
    await Course.deleteMany({});
    await Lecture.deleteMany({});
    
}

seedDB().then(()=>{
    mongoose.connection.close();
});