const express = require('express')
const router = express.Router();
const Course = require("../models/course")

const { isLoggedIn,isTeacher } = require('../middleware')

router.route('/')
    .get(async(req, res) => {
        const courses = await Course.find({}).populate('teacher');
        //console.log(courses)
        res.render("courses/index",{courses})
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

module.exports = router;