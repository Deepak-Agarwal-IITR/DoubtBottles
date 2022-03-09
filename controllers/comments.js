const Lecture = require('../models/lecture')
const Comment = require('../models/comment')
const { cloudinary } = require("../cloudinary");

module.exports.renderQuestionForm = (req, res) => {
    const {id,lectureId} = req.params
    res.render("comments/new",{id,lectureId})
};

module.exports.createQuestion = async (req, res) => {
    const { id,lectureId } = req.params
    const lecture = await Lecture.findById(lectureId);
    const comment = new Comment(req.body.comment)
    comment.images = req.files.map(f=>({url:f.path,filename:f.filename}))
    comment.user = req.user;
    lecture.comments.push(comment)
    comment.createdOn = new Date();
    await comment.save();
    await lecture.save();
    req.flash('success', "Added question")
    res.redirect(`/courses/${id}/lectures/${lectureId}`)
};

module.exports.likeDislikeComment = async (req, res) => {
    const { like } = req.query;

    const { id, lectureId, commentId } = req.params
    const comment = await Comment.findById(commentId);

    const isLiked = comment.likedBy.includes(req.user._id);
    const isDisliked = comment.dislikedBy.includes(req.user._id);
    if(like=="true"){
        if(!isLiked && !isDisliked){
            comment.likedBy.push(req.user);
        } else if (isLiked && !isDisliked) {
            comment.likedBy.pull(req.user);
        } else if (!isLiked && isDisliked) {
            comment.dislikedBy.pull(req.user);
            comment.likedBy.push(req.user);
        }
    } else if (like == "false") {
        if (!isLiked && !isDisliked) {
            comment.dislikedBy.push(req.user);        
        } else if (isLiked && !isDisliked) {
            comment.likedBy.pull(req.user);
            comment.dislikedBy.push(req.user);
        } else if (!isLiked && isDisliked) {
            comment.dislikedBy.pull(req.user);
        }
    }

    await comment.save();
    res.redirect(`/courses/${id}/lectures/${lectureId}`);
};

module.exports.addReply = async (req, res) => {
    const { id, lectureId,commentId } = req.params
    const foundComment = await Comment.findById(commentId);
    const addedComment = new Comment(req.body.comment)
    addedComment.images = req.files.map(f=>({url:f.path,filename:f.filename}))
    addedComment.user = req.user;
    foundComment.comments.push(addedComment);
    addedComment.createdOn = new Date();
    await addedComment.save()
    await foundComment.save()
    req.flash('success', "Added reply")
    res.redirect(`/courses/${id}/lectures/${lectureId}`)
};

module.exports.renderEditCommentForm = async(req, res) => {
    const { id, lectureId,commentId } = req.params
    const foundComment = await Comment.findById(commentId)
    res.render("comments/edit", { id, lectureId,comment:foundComment })
};

module.exports.editComment = async (req, res) => {
    const { id, lectureId, commentId } = req.params
    const comment = await Comment.findByIdAndUpdate(commentId, { ...req.body.comment });
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    comment.images.push(...images)
    await comment.save()

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await comment.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        //console.log(comment);
    }
    await comment.save();
    req.flash('success', "Updated comment")
    res.redirect(`/courses/${id}/lectures/${lectureId}`)
};

module.exports.deleteQuestion = async (req, res) => {
    const { id, lectureId, commentId } = req.params
    await Lecture.findByIdAndUpdate(lectureId,{$pull:{comments:commentId}});
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', "Deleted Comment")
    res.redirect(`/courses/${id}/lectures/${lectureId}`)
};

module.exports.deleteReply = async (req,res)=>{
    const { id, lectureId, parentId,commentId } = req.params
    await Comment.findByIdAndUpdate(parentId,{$pull:{comments:commentId}});
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', "Deleted Comment")
    res.redirect(`/courses/${id}/lectures/${lectureId}`)
};