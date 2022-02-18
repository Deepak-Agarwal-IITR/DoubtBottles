const Course = require('./models/course')
const Comment = require('./models/comment')
const catchAsync = require("./utils/catchAsync");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You musted be signed in')
        return res.redirect('/login')
    }
    next();
}

module.exports.isTeacher = catchAsync(async(req,res,next) => {
    const {id} = req.params;
    const course = await Course.findById(id);
    if(!course.teacher.equals(req.user._id)){
        req.flash('error',"You don't have permissions")
        return res.redirect(`/courses/${id}`);
    }
    next();
})

module.exports.isCommentUser = catchAsync(async(req,res,next) => {
    const { id,lectureId,commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if(!comment.user.equals(req.user._id)){
        req.flash('error', "You don't have permissions")
        return res.redirect(`/courses/${id}/lectures/${lectureId}`);
    }
    next();
})

module.exports.isEnrolledInCourse = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findById(id);
    if(!(course.users.includes(req.user._id) || course.teacher.equals(req.user._id))){
        req.flash('error', "You are not a member of the course.")
        return res.redirect(`/courses/${id}`);
    }
    next();
})

module.exports.isAlreadyEnrolled = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findById(id);
    if ((course.users.includes(req.user._id) || course.teacher.equals(req.user._id))) {
        req.flash('error', "You are already in the course.")
        return res.redirect(`/courses/${id}`);
    }
    next();
})