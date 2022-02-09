const express = require('express')
const router = express.Router({mergeParams:true});

const { isLoggedIn,isCommentUser,isEnrolledInCourse } = require('../middleware')
const comments = require("../controllers/comments");
const catchAsync = require('../utils/catchAsync')

router.get("/new", isLoggedIn,isEnrolledInCourse, comments.renderQuestionForm)
router.route("/", isLoggedIn, isEnrolledInCourse)
    .post(catchAsync(comments.createQuestion))

router.route('/:commentId', isLoggedIn,isEnrolledInCourse)
    .get(catchAsync(comments.likeDislikeComment))
    .post(catchAsync(comments.addReply))
    .put(isCommentUser,catchAsync(comments.editComment))
    .delete(isCommentUser,catchAsync(comments.deleteQuestion))

router.delete("/:parentId/:commentId",isLoggedIn,isEnrolledInCourse,isCommentUser,catchAsync(comments.deleteReply))
    
router.get('/:commentId/reply', isLoggedIn,isEnrolledInCourse, comments.renderReplyForm)
router.get('/:commentId/edit', isLoggedIn,isEnrolledInCourse,isCommentUser, catchAsync(comments.renderEditCommentForm))

module.exports = router;