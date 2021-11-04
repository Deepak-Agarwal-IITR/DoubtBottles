const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/user')
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
module.exports = router;