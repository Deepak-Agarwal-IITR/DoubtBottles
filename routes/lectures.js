const express = require('express')
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isTeacher,isEnrolledInCourse } = require('../middleware')
const lectures = require("../controllers/lectures");

router.get("/new", isLoggedIn, isTeacher,lectures.renderNewLectureForm)

router.route("/",isLoggedIn,isTeacher)
    .post(catchAsync(lectures.createNewLecture))

router.route("/:lectureId")
    .get(isLoggedIn, isEnrolledInCourse, catchAsync(lectures.showLecture))
    .put(isLoggedIn,isTeacher,catchAsync(lectures.editLecture))
    .delete(isLoggedIn,isTeacher,catchAsync(lectures.deleteLecture))

router.get('/:lectureId/edit', isLoggedIn,isTeacher, catchAsync(lectures.renderEditLectureForm))

module.exports = router;