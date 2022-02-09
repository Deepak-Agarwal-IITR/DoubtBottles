const express = require('express')
const router = express.Router({mergeParams:true});

const { isLoggedIn, isTeacher,isEnrolledInCourse } = require('../middleware')
const lectures = require("../controllers/lectures");

router.get("/new", isLoggedIn, isTeacher,lectures.renderNewLectureForm)

router.route("/",isLoggedIn,isTeacher)
    .post(lectures.createNewLecture)

router.route("/:lectureId")
    .get(isLoggedIn, isEnrolledInCourse, lectures.showLecture)
    .put(isLoggedIn,isTeacher,lectures.editLecture)
    .delete(isLoggedIn,isTeacher,lectures.deleteLecture)

router.get('/:lectureId/edit', isLoggedIn,isTeacher, lectures.renderEditLectureForm)

module.exports = router;