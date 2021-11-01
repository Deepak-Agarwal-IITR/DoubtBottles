const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const Course = require("./models/course")
const Comment = require("./models/comment")
mongoose.connect('mongodb://localhost:27017/doubtapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected")
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname,'public')))


app.get('/courses', async(req, res) => {
    const courses = await Course.find({});
    //console.log(courses)
    res.render("courses/index",{courses})
})
app.post('/courses', async(req, res) => {
    const course = new Course(req.body.course)
    //console.log(course)
    await course.save();
    res.redirect("/courses")
})
app.get('/courses/new', (req, res) => {
    res.render("courses/new")
})
app.get('/courses/:id', async (req, res) => {
    const {id} = req.params
    const course = await Course.findById(id).populate('comments')
    res.render('courses/show',{course})
    
})
app.get('/courses/:id/edit', async (req, res) => {
    const { id } = req.params
    const course = await Course.findById(id)
    res.render('courses/edit', { course })
})
app.put('/courses/:id', async(req, res) => {
    const { id } = req.params
    const course = await Course.findByIdAndUpdate(id,{...req.body.course})
    res.redirect(`/courses/${id}`)
})

app.delete('/courses/:id', async (req, res) => {
    const { id } = req.params
    await Course.findByIdAndDelete(id)
    res.redirect('/courses')
})

app.get("/courses/:id/comments/new", (req, res) => {
    const {id} = req.params
    res.render("comments/new",{id})
})
app.post("/courses/:id/comments", async (req, res) => {
    const { id } = req.params
    const course = await Course.findById(id);
    const comment = new Comment(req.body.comment)
    course.comments.push(comment)
    console.log(course)
    console.log(comment)
    await comment.save();
    await course.save();
    res.redirect(`/courses/${id}`)
})

app.get('/courses/:id/comments/:commentId/reply', (req, res) => {
    const { id, commentId } = req.params
    res.render("comments/reply",{id,commentId})
})
app.post('/courses/:id/comments/:commentId', async(req, res) => {
    const { id, commentId } = req.params
    const foundComment = await Comment.findById(commentId);
    const addedComment = new Comment(req.body.comment)
    foundComment.comments.push(addedComment);
    console.log(foundComment)
    console.log(addedComment)
    await addedComment.save()
    await foundComment.save()
    res.redirect(`/courses/${id}`)
})
app.listen(8080, () => {
    console.log("Listening on 8080")
})