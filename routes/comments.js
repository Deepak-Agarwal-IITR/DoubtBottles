const express = require('express')
const router = express.Router({mergeParams:true});

const { isLoggedIn,isCommentUser,isEnrolledInCourse } = require('../middleware')
const comments = require("../controllers/comments");
const catchAsync = require('../utils/catchAsync')

const multer = require('multer');
const { commentImageStorage } = require('../cloudinary');
const upload = multer({ storage:commentImageStorage });

router.get("/new", isLoggedIn,isEnrolledInCourse, comments.renderQuestionForm)
router.route("/")
    .post(isLoggedIn, isEnrolledInCourse, upload.array('image'),catchAsync(comments.createQuestion))

router.route('/:commentId')
    .get(isLoggedIn, isEnrolledInCourse, catchAsync(comments.likeDislikeComment))
    .post(isLoggedIn, isEnrolledInCourse, upload.array('image'), catchAsync(comments.addReply))
    .put(isLoggedIn, isEnrolledInCourse, isCommentUser, upload.array('image'), catchAsync(comments.editComment))
    .delete(isLoggedIn, isEnrolledInCourse, isCommentUser, catchAsync(comments.deleteQuestion))

router.delete("/:parentId/:commentId",isLoggedIn,isEnrolledInCourse,isCommentUser,catchAsync(comments.deleteReply))

router.get('/:commentId/edit', isLoggedIn,isEnrolledInCourse,isCommentUser, catchAsync(comments.renderEditCommentForm))

module.exports = router;