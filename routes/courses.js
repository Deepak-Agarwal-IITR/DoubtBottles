const express = require('express')
const router = express.Router();
const { isLoggedIn,isTeacher,isAlreadyEnrolled } = require('../middleware')
const courses = require("../controllers/courses");
router.route('/')
    .get(courses.showAllCourses)
    .post(isLoggedIn, courses.createNewCourse)

router.get('/new',isLoggedIn, courses.renderNewCourseForm)

router.route('/my',isLoggedIn)
    .get(courses.showMyCourses)
router.route('/:id')
    .get(courses.showCourse)
    .put(isLoggedIn, isTeacher, courses.editCourse)
    .delete(isLoggedIn, isTeacher, courses.deleteCourse)
    
router.get('/:id/edit', isLoggedIn, isTeacher, courses.renderEditCourseForm)

router.post('/:id/enroll', isLoggedIn, isAlreadyEnrolled, courses.notifyTeacherForEnrollment);

module.exports = router;