const Course = require("../models/course")
const Notification = require("../models/notification")

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

    const notification = new Notification({
        description: `An announcement has been made in <a href=/courses/${course._id}/announcements>${course.name}</a>`, 
        sender: req.user._id, 
        receivers: course.users, 
        category: 'announcement',
        createdOn : new Date(),
        course
    });
    await notification.save();
    req.flash("success","Announcement made successfully")
    res.redirect(`/courses/${course._id}/announcements`)   
}

module.exports.showAnnouncements = async (req,res)=>{
    const {id} = req.params;
    const course = await Course.findById(id);
    res.render("courses/announcement",{announcements: course.announcements,course})
}