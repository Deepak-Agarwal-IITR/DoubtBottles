const Course = require("../models/course")
const User = require("../models/user");
const Notification = require("../models/notification")
const { cloudinary } = require("../cloudinary");

module.exports.showAllCourses = async(req, res) => {
    const courses = await Course.find({}).populate('teacher');
    //console.log(courses)
    res.render("courses/index",{courses,title:"All Courses"})
};

module.exports.createNewCourse = async(req, res) => {
    const course = new Course(req.body.course)
    course.teacher = req.user;
    if(req.file)
        course.image = {url: req.file.path,filename:req.file.filename}
    else
        course.image = {url:"/images/course.jpg"}
    await course.save();
    req.flash('success',"Created a new course")
    res.redirect("/courses")
};

module.exports.renderNewCourseForm = (req, res) => {
    res.render("courses/new")
};

module.exports.showMyCourses = async (req, res) => {
    const courses = await Course.find({$or:[{users: req.user._id},{teacher: req.user._id}]}).populate('teacher');
    
    res.render("courses/index", { courses,title:"My Courses" })
}

module.exports.showCourse = async (req, res) => {
    const {id} = req.params
    const course = await Course.findById(id).populate('lectures').populate('teacher');
    res.render('courses/show',{course})
}

module.exports.renderEditCourseForm = async (req, res) => {
    const { id } = req.params
    const course = await Course.findById(id)
    res.render('courses/edit', { course })
}

module.exports.editCourse = async(req, res) => {
    const { id } = req.params
    const course = await Course.findByIdAndUpdate(id,{...req.body.course})
    if(req.file){
        if(course.image.filename)
            await cloudinary.uploader.destroy(course.image.filename);
        course.image = {url: req.file.path,filename:req.file.filename}
    }
    await course.save();
    req.flash('success',"Updated course")
    res.redirect(`/courses/${id}`)
}

module.exports.deleteCourse = async (req, res) => {
    const { id } = req.params
    await Course.findByIdAndDelete(id)
    req.flash('success',"Deleted course")
    res.redirect('/courses')
}

module.exports.notifyTeacherForEnrollment = async (req, res) => {
    const { id } = req.params;
    const course = await Course.findById(id);
    const receivers = [{
        id: course.teacher
    }]
    const notification = new Notification({ 
        description: `${req.user.username} wants to enroll in Your Course: <a href=/courses/${course._id}>${course.name}</a>`, 
        sender: req.user._id, 
        receivers, 
        course,
        category:"enroll",
        createdOn: new Date()
    });
    await notification.save();
    for(let receiver of receivers){
        const rece = await User.findById(receiver.id);
        rece.numberOfNotifications = rece.numberOfNotifications+1;
        await rece.save();
    }
    req.flash('success', "Notified the teacher, wait for the response");
    res.redirect(`/courses/${id}`)
}

module.exports.renderSettingsPage = (req,res)=>{
    const {id} = req.params;
    res.render('courses/settings',{id})
}