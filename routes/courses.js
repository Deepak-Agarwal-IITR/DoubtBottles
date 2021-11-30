const express = require('express')
const router = express.Router();
const Course = require("../models/course")
const User = require("../models/user");
const Notification = require("../models/notification")
const { isLoggedIn,isTeacher,isAlreadyEnrolled } = require('../middleware')

router.route('/')
    .get(async(req, res) => {
        const courses = await Course.find({}).populate('teacher');
        //console.log(courses)
        res.render("courses/index",{courses,title:"All Courses"})
    })
    .post(isLoggedIn, async(req, res) => {
        const course = new Course(req.body.course)
        course.teacher = req.user;
        await course.save();
        req.flash('success',"Created a new course")
        res.redirect("/courses")
    })

router.get('/new',isLoggedIn, (req, res) => {
    res.render("courses/new")
})
router.route('/my',isLoggedIn)
    .get(async (req, res) => {
        const courses = await Course.find({$or:[{users: req.user._id},{teacher: req.user._id}]}).populate('teacher');
        
        res.render("courses/index", { courses,title:"My Courses" })
    })
router.route('/:id')
    .get(async (req, res) => {
        const {id} = req.params
        const course = await Course.findById(id).populate('lectures').populate('teacher');
        res.render('courses/show',{course})
    })
    .put(isLoggedIn, isTeacher, async(req, res) => {
        const { id } = req.params
        const course = await Course.findByIdAndUpdate(id,{...req.body.course})
         req.flash('success',"Updated course")
        res.redirect(`/courses/${id}`)
    })
    .delete(isLoggedIn, isTeacher, async (req, res) => {
        const { id } = req.params
        await Course.findByIdAndDelete(id)
        req.flash('success',"Deleted course")
        res.redirect('/courses')
    })
    
router.get('/:id/edit', isLoggedIn, isTeacher, async (req, res) => {
    const { id } = req.params
    const course = await Course.findById(id)
    res.render('courses/edit', { course })
})

router.post('/:id/enroll', isLoggedIn, isAlreadyEnrolled, async (req, res) => {
    const { id } = req.params;
    const course = await Course.findById(id);
    const teacher = await User.findById(course.teacher);
    const notification = new Notification({ description: `${req.user.username} wants to enroll in Your Course: ${course.name}`, sender: req.user._id, receiver: teacher._id, course,category:"enroll"});
    teacher.notifications.push(notification);
    await teacher.save();
    await notification.save();

    req.flash('success', "Notified the teacher, wait for the response");
    res.redirect(`/courses/${id}`)
});



module.exports = router;