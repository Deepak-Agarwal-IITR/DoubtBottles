const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/user')
const Course = require('../models/course')
const Notification = require('../models/notification');
const catchAsync = require('../utils/catchAsync')
router.route('/register',)
    .get((req,res)=>{
        res.render('users/register')
    })
    .post(catchAsync(async (req,res)=>{
        try {
            const { username, password } = req.body.user;
            const user = new User({ username });
            const registeredUser = await User.register(user, password);
            //console.log(registeredUser);
            req.login(registeredUser,err=>{
                if(err) return next(err);
                req.flash('success', 'Welcome!')
                res.redirect('/courses');
            })
        } catch (e) {
            req.flash('error',e.message)
            res.redirect('/register')
        }
    }))

router.route('/login')
    .get((req,res)=>{
        res.render('users/login')
    })
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}) , (req, res) => {
        req.flash('success','Welcome back!')
        res.redirect('/courses')
    })

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','Bye! You are logged out successfully.')
    res.redirect('/courses')
})

router.get('/notifications', async(req, res) => {
    const user = await User.findById(req.user._id).populate('notifications');
    res.render('users/notifications',{notifications: user.notifications});
})
router.get('/notifications/:id',async(req,res)=>{
    const toAccept = req.query.toAccept;
    const notification = await Notification.findById(req.params.id);
    if(toAccept=="true"){
        const course = await Course.findById(notification.course._id);
        course.users.push(notification.sender);
        await course.save();
        const sender = await User.findById(notification.sender._id);
        req.flash('success',`${sender.username} has been Enrolled in the course: ${course.name}.`)
        res.redirect('/notifications');
    }else{
        console.log("rejected");
    }
})
module.exports = router;