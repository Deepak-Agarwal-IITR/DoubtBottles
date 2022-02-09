const Course = require("../models/course")
const Lecture = require("../models/lecture")

module.exports.renderNewLectureForm = (req, res) => {
    const {id} = req.params
    res.render("lectures/new",{id})
};

module.exports.createNewLecture = async (req, res) => {
    const { id } = req.params
    const course = await Course.findById(id);
    const lecture = new Lecture(req.body.lecture)
    course.lectures.push(lecture)
    await lecture.save();
    await course.save();
    req.flash('success',"Created a new lecture")
    res.redirect(`/courses/${id}`)
};

module.exports.showLecture = async (req, res) => {
    const {id,lectureId} = req.params
    const course = await Course.findById(id);
    const lecture = await Lecture.findById(lectureId)
    res.render('lectures/show',{lecture,course})
};

module.exports.renderEditLectureForm = async (req, res) => {
    const {id,lectureId } = req.params
    const lecture = await Lecture.findById(lectureId)
    res.render('lectures/edit', { lecture,id})
}

module.exports.editLecture = async(req, res) => {
    const { id,lectureId } = req.params
    const lecture = await Lecture.findByIdAndUpdate(lectureId,{...req.body.lecture})
    req.flash('success', "Updated Lecture")
    res.redirect(`/courses/${id}/lectures/${lectureId}`)
};

module.exports.deleteLecture = async (req, res) => {
    const { id ,lectureId} = req.params
    await Course.findByIdAndUpdate(id,{$pull: {lectures:lectureId}});
    await Lecture.findByIdAndDelete(lectureId)
    req.flash('success', "Deleted Lecture")
    res.redirect(`/courses/${id}`)
};