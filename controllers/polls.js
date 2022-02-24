const Course = require("../models/course")
const Notification = require("../models/notification")

module.exports.createNewPoll = async (req,res)=>{
    const {id} = req.params;
    const {question,options,endOn,endTime} = req.body;
    const optionObjects = [];
    for(let option of options){
        optionObjects.push({text:option,users:[]});
    }
    var parts = endOn.split('-');
    var timeParts = endTime.split(':')
    // JavaScript counts months from 0: January - 0, February - 1, etc.
    const endDate = new Date(parts[0], parts[1]-1, parts[2],timeParts[0],timeParts[1]); 
    const course = await Course.findById(id);
    const poll = {
        question,
        options:optionObjects,
        createdOn: new Date(),
        endOn:endDate
    }
    course.polls.push(poll);
    await course.save();
    const receivers = course.users.map(function makeUser(user){
        return {id:user};
    });
    const notification = new Notification({
        description: `A new poll is being conducted in <a href=/courses/${course._id}/polls>${course.name}</a>.`, 
        sender: req.user._id, 
        receivers, 
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
    const polls = course.polls.map(function makePoll(poll){
        poll.marked = hasUserAlreadyVoted(poll,req.user._id)
        return poll;
    });
    res.render("courses/poll",{polls,course})
} 

module.exports.addVote = async(req,res)=>{
    const {id,pollId} = req.params;
    const course = await Course.findById(id);
    const poll = course.polls.find(poll=>poll._id.toString()===pollId);
    if(hasUserAlreadyVoted(poll,req.user._id)){
        req.flash("error","You have already voted")
        return res.redirect(`/courses/${id}/polls`);
    }else if(poll.endOn < new Date()){
        req.flash("error","Poll has ended.")
        return res.redirect(`/courses/${id}/polls`);
    }
    const option = poll.options.find(option=>option._id.toString()===req.body.option)
    option.users.push(req.user._id);
    await course.save();
    res.redirect(`/courses/${id}/polls`);
}

function hasUserAlreadyVoted(poll,userId){
    for(let option of poll.options){
        if(option.users.includes(userId)){
            return option._id;
        }
    }
    return null;
}