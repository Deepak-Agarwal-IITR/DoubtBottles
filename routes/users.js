const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/user')
const Course = require('../models/course')
const Notification = require('../models/notification');
const catchAsync = require('../utils/catchAsync')

const { isLoggedIn } = require('../middleware')
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

router.get('/notifications', isLoggedIn, async(req, res) => {
    const user = await User.findById(req.user._id).populate('notifications');
    res.render('users/notifications',{notifications: user.notifications});
})
router.get('/notifications/:id',isLoggedIn,async(req,res)=>{
    const toAccept = req.query.toAccept;
    const notification = await Notification.findById(req.params.id);
    
    const course = await Course.findById(notification.course._id);
    const sender = await User.findById(notification.sender._id);
    const receiver = await User.findById(notification.receiver._id);

    if(toAccept=="true"){
        course.users.push(notification.sender);
        await course.save();
        notification.isResolved = true;
        await notification.save();

        const sendNotification = new Notification({ description: `You have been enrolled in ${course.name} by ${receiver.username}.`, sender: receiver._id, receiver: sender._id, category: 'message' });
        sendNotification.createdOn = new Date();
        sender.notifications.push(sendNotification);
        await sendNotification.save();
        await sender.save();

        req.flash('success',`${sender.username} has been Enrolled in the course: ${course.name}.`)
        res.redirect('/notifications');
    } else {
        notification.isResolved = true;
        await notification.save();

        const sendNotification = new Notification({ description: `Your request for enrolling in ${course.name} by ${receiver.username} has been canceled.`, sender: receiver._id, receiver: sender._id, category: 'message' });
        sendNotification.createdOn = new Date();
        sender.notifications.push(sendNotification);
        await sendNotification.save();
        await sender.save();
        
        req.flash('success',`${sender.username} request has been canceled for the course: ${course.name}.`)
        res.redirect('/notifications');
    }
})
module.exports = router;