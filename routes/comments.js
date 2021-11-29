const express = require('express')
const router = express.Router({mergeParams:true});
const Lecture = require('../models/lecture')
const Comment = require('../models/comment')

const { isLoggedIn,isCommentUser,isEnrolledInCourse } = require('../middleware')

router.get("/new", isLoggedIn,isEnrolledInCourse, (req, res) => {
    const {id,lectureId} = req.params
    res.render("comments/new",{id,lectureId})
})
router.post("/", isLoggedIn,isEnrolledInCourse, async (req, res) => {
    const { id,lectureId } = req.params
    const lecture = await Lecture.findById(lectureId);
    const comment = new Comment(req.body.comment)
    comment.user = req.user;
    lecture.comments.push(comment)
    await comment.save();
    await lecture.save();
    req.flash('success', "Added question")
    res.redirect(`/courses/${id}/lectures/${lectureId}`)
})

router.route('/:commentId', isLoggedIn,isEnrolledInCourse)
    .post(async (req, res) => {
        const { id, lectureId,commentId } = req.params
        const foundComment = await Comment.findById(commentId);
        const addedComment = new Comment(req.body.comment)
        addedComment.user = req.user;
        foundComment.comments.push(addedComment);
        await addedComment.save()
        await foundComment.save()
        req.flash('success', "Added reply")
        res.redirect(`/courses/${id}/lectures/${lectureId}`)
    })
    .put(isCommentUser,async (req, res) => {
        console.log(req.params)
        console.log(req.body)
        console.log(req.body.comment)
        const { id, lectureId, commentId } = req.params
        const comment = await Comment.findByIdAndUpdate(commentId, { ...req.body.comment });
        await comment.save();
        req.flash('success', "Updated comment")
        res.redirect(`/courses/${id}/lectures/${lectureId}`)
    })
    .delete(isCommentUser,async (req, res) => {
        const { id, lectureId, commentId } = req.params
        await Comment.findByIdAndDelete(commentId);
        req.flash('success', "Deleted Comment")
        res.redirect(`/courses/${id}/lectures/${lectureId}`)
    })

    
router.get('/:commentId/reply', isLoggedIn,isEnrolledInCourse, (req, res) => {
    const { id, lectureId,commentId } = req.params
    res.render("comments/reply", { id, lectureId,commentId })
})
router.get('/:commentId/edit', isLoggedIn,isEnrolledInCourse,isCommentUser, async(req, res) => {
    const { id, lectureId,commentId } = req.params
    const foundComment = await Comment.findById(commentId)
    res.render("comments/edit", { id, lectureId,comment:foundComment })
})

module.exports = router;