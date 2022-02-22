const Course = require("../models/course")

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

    res.render("courses/poll",{polls: course.polls,courseId:id})   
}

module.exports.showPolls = async (req,res)=>{
    const {id} = req.params;
    const course = await Course.findById(id);
    res.render("courses/poll",{polls: course.polls,courseId:id})
}