const Course = require("../models/course")
const Notification = require("../models/notification")

module.exports.createNewPoll = async (req,res)=>{
    const {id} = req.params;
    const {question,options,endOn} = req.body;
    const course = await Course.findById(id);
    const poll = {
        question,
        options,
        createdOn: new Date(),
        endOn
    }
    course.polls.push(poll);
    await course.save();

    const notification = new Notification({
        description: `A new poll is being conducted in <a href=/courses/${course._id}/polls>${course.name}</a>.`, 
        sender: req.user._id, 
        receivers: course.users, 
        category: 'poll',
        createdOn : new Date(),
        course
    });
    await notification.save();
    req.flash("success","Poll made successfully")
    res.redirect(`/courses/${course._id}/polls`) 
}

module.exports.showPolls = async (req,res)=>{
    const {id} = req.params;
    const course = await Course.findById(id);
    res.render("courses/poll",{polls: course.polls,course})
}