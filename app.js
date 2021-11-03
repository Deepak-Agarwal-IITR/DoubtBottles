const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const courseRouter = require("./routes/courses")
const lectureRouter = require("./routes/lectures")
const commentRouter = require("./routes/comments")
const userRouter = require("./routes/users")

const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local')

const User = require('./models/user')
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

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now()+1000*60*60*24*7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user;
    next();
})
app.use('/courses', courseRouter)
app.use('/courses/:id/lectures', lectureRouter)
app.use('/courses/:id/lectures/:lectureId/comments',commentRouter)
app.use('/',userRouter)


app.listen(8080, () => {
    console.log("Listening on 8080")
})