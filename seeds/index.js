const mongoose = require('mongoose');
const Course = require('../models/course')
const Lecture = require('../models/lecture')
const Comment = require('../models/comment')
const User = require('../models/user')
const Notification = require('../models/notification')

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
    
    await Course.deleteMany({});
    console.log("Deleted courses")
    await User.deleteMany({});
    console.log("Deleted users")
    await Notification.deleteMany({});
    console.log("Deleted notifications")

    const user1 = new User({ username:"a@gmail.com" });
    const registeredUser1 = await User.register(user1, "a");
    const user2 = new User({ username:"b@gmail.com" });
    const registeredUser2 = await User.register(user2, "b");
    const user3 = new User({ username:"c@gmail.com" });
    const registeredUser3 = await User.register(user3, "c");
}

seedDB().then(()=>{
    mongoose.connection.close();
});