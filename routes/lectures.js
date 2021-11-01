const express = require('express')
const router = express.Router({mergeParams:true});
const Course = require("../models/course")
const Lecture = require("../models/lecture")

router.get("/new", (req, res) => {
    const {id} = req.params
    res.render("lectures/new",{id})
})

router.route("/")
    .post(async (req, res) => {
        const { id } = req.params
        const course = await Course.findById(id);
        const lecture = new Lecture(req.body.lecture)
        course.lectures.push(lecture)
        await lecture.save();
        await course.save();
        res.redirect(`/courses/${id}`)
    })

router.route("/:lectureId")
    .get(async (req, res) => {
        const {id,lectureId} = req.params
        const lecture = await Lecture.findById(lectureId).populate('comments')
        res.render('lectures/show',{lecture,id})
    })
    .put(async(req, res) => {
        const { id,lectureId } = req.params
        const lecture = await Lecture.findByIdAndUpdate(lectureId,{...req.body.lecture})
        res.redirect(`/courses/${id}/lectures/${lectureId}`)
    })
    .delete(async (req, res) => {
        const { id ,lectureId} = req.params
        await Lecture.findByIdAndDelete(lectureId)
        res.redirect(`/courses/${id}`)
    })

router.get('/:lectureId/edit', async (req, res) => {
    const {id,lectureId } = req.params
    const lecture = await Lecture.findById(lectureId)
    res.render('lectures/edit', { lecture,id})
})

module.exports = router;