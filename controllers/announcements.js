const Course = require("../models/course")

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

    res.render("courses/announcement",{announcements: course.announcements,courseId:id})   
}

module.exports.showAnnouncements = async (req,res)=>{
    const {id} = req.params;
    const course = await Course.findById(id);
    res.render("courses/announcement",{announcements: course.announcements,courseId:id})
}