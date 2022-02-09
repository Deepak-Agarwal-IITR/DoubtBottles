const express = require('express');
const router = express.Router();
const passport = require('passport')
const users = require("../controllers/users");
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn } = require('../middleware')

router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}) , users.login);

router.get('/logout',users.logout)

router.get('/notifications', isLoggedIn, catchAsync(users.showAllNotifications))
router.get('/notifications/:id',isLoggedIn,catchAsync(users.resolveNotification));
module.exports = router;