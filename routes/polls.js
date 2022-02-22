const express = require('express')
const router = express.Router({mergeParams:true});
const { isLoggedIn,isTeacher,isEnrolledInCourse} = require('../middleware')
const polls = require("../controllers/polls");
const catchAsync = require('../utils/catchAsync')

router.route('/')
    .get(isLoggedIn,isEnrolledInCourse,catchAsync(polls.showPolls))
    .post(isLoggedIn,isTeacher,catchAsync(polls.createNewPoll))


module.exports = router;