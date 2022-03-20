const Course = require("../models/course")
const Notification = require("../models/notification")
const User = require("../models/user")
module.exports.createNewAnnouncement = async (req,res)=>{
    const {id} = req.params;
    const {description} = req.body;
    const course = await Course.findById(id);
    const announcement = {
        description,
        createdOn: new Date()
    }
    course.announcements.push(announcement);
    await course.save();
    const receivers = course.users.map(function makeUser(user){
        return {id:user};
    });
    const notification = new Notification({
        description: `An announcement has been made in <a href=/courses/${course._id}/announcements>${course.name}</a>`, 
        sender: req.user._id, 
        receivers, 
        category: 'announcement',
        createdOn : new Date(),
        course
    });
    await notification.save();
    for(let receiver of receivers){
        const rece = await User.findById(receiver.id);
        rece.numberOfNotifications = rece.numberOfNotifications+1;
        await rece.save();
    }
    req.flash("success","Announcement made successfully")
    res.redirect(`/courses/${course._id}/announcements`)   
}

module.exports.showAnnouncements = async (req,res)=>{
    const {id} = req.params;
    const course = await Course.findById(id);
    res.render("courses/announcement",{announcements: course.announcements,course})
}