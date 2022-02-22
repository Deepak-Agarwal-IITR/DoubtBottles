const express = require('express')
const router = express.Router({mergeParams:true});
const { isLoggedIn,isTeacher,isAlreadyEnrolled} = require('../middleware')
const announcements = require("../controllers/announcements");
const catchAsync = require('../utils/catchAsync')

router.route('/')
    .get(isLoggedIn,isAlreadyEnrolled,catchAsync(announcements.showAnnouncements))
    .post(isLoggedIn,isTeacher,catchAsync(announcements.createNewAnnouncement))


module.exports = router;