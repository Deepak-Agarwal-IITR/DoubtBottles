const express = require('express')
const router = express.Router();
const { isLoggedIn,isTeacher,isAlreadyEnrolled, isEnrolledInCourse } = require('../middleware')
const courses = require("../controllers/courses");
const catchAsync = require('../utils/catchAsync')

const multer = require('multer');
const { courseImageStorage } = require('../cloudinary');
const upload = multer({ storage:courseImageStorage });

router.route('/')
    .get(catchAsync(courses.showAllCourses))
    .post(isLoggedIn, upload.single('image'),catchAsync(courses.createNewCourse))

router.get('/new',isLoggedIn, courses.renderNewCourseForm)

router.route('/my',isLoggedIn)
    .get(catchAsync(courses.showMyCourses))
router.route('/:id')
    .get(catchAsync(courses.showCourse))
    .put(isLoggedIn, isTeacher,upload.single('image'), catchAsync(courses.editCourse))
    .delete(isLoggedIn, isTeacher, catchAsync(courses.deleteCourse))
    
router.get('/:id/edit', isLoggedIn, isTeacher, catchAsync(courses.renderEditCourseForm))

router.post('/:id/enroll', isLoggedIn, isAlreadyEnrolled, catchAsync(courses.notifyTeacherForEnrollment))

router.get('/:id/settings', isLoggedIn, isEnrolledInCourse, catchAsync(courses.renderSettingsPage))

module.exports = router;