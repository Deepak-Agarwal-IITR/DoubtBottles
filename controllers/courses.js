const Course = require("../models/course")
const User = require("../models/user");
const Notification = require("../models/notification")

module.exports.showAllCourses = async(req, res) => {
    const courses = await Course.find({}).populate('teacher');
    //console.log(courses)
    res.render("courses/index",{courses,title:"All Courses"})
};

module.exports.createNewCourse = async(req, res) => {
    const course = new Course(req.body.course)
    course.teacher = req.user;
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
    const teacher = await User.findById(course.teacher);
    const notification = new Notification({ description: `${req.user.username} wants to enroll in Your Course: ${course.name}`, sender: req.user._id, receiver: teacher._id, course,category:"enroll"});
    notification.createdOn = new Date();
    teacher.notifications.push(notification);
    await teacher.save();
    await notification.save();

    req.flash('success', "Notified the teacher, wait for the response");
    res.redirect(`/courses/${id}`)
}
