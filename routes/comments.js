const express = require('express')
const router = express.Router({mergeParams:true});

const { isLoggedIn,isCommentUser,isEnrolledInCourse } = require('../middleware')
const comments = require("../controllers/comments");

router.get("/new", isLoggedIn,isEnrolledInCourse, comments.renderQuestionForm)
router.route("/", isLoggedIn, isEnrolledInCourse)
    .post(comments.createQuestion)

router.route('/:commentId', isLoggedIn,isEnrolledInCourse)
    .get(comments.likeDislikeComment)
    .post(comments.addReply)
    .put(isCommentUser,comments.editComment)
    .delete(isCommentUser,comments.deleteQuestion)

router.delete("/:parentId/:commentId",isLoggedIn,isEnrolledInCourse,isCommentUser,comments.deleteReply)
    
router.get('/:commentId/reply', isLoggedIn,isEnrolledInCourse, comments.renderReplyForm)
router.get('/:commentId/edit', isLoggedIn,isEnrolledInCourse,isCommentUser, comments.renderEditCommentForm)

module.exports = router;