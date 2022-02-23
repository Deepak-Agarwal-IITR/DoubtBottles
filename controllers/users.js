const User = require('../models/user')
const Course = require('../models/course')
const Notification = require('../models/notification');

module.exports.renderRegisterForm = (req,res)=>{
    res.render('users/register')
};

module.exports.register = async (req,res)=>{
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
};

module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login')
};

module.exports.login = (req, res) => {
    req.flash('success','Welcome back!')
    const redirectUrl = req.session.returnTo || '/courses'
    delete req.session.returnTo;
    res.redirect(redirectUrl)
};

module.exports.logout = (req,res)=>{
    req.logout();
    req.flash('success','Bye! You are logged out successfully.')
    res.redirect('/courses')
};

module.exports.showAllNotifications = async(req, res) => {
    const notifications = await Notification.find({receivers: req.user._id});
    res.render('users/notifications',{notifications});
};

module.exports.resolveNotification = async(req,res)=>{
    const toAccept = req.query.toAccept;
    const notification = await Notification.findById(req.params.id);
    const course = await Course.findById(notification.course._id);
    const sender = await User.findById(notification.sender._id);
    const receiver = await User.findById(req.user._id);
    
    if(toAccept=="true"){
        course.users.push(notification.sender);
        await course.save();
        notification.isResolved = true;
        await notification.save();

        const sendNotification = new Notification({ 
            description: `You have been enrolled in ${course.name} by ${receiver.username}.`, 
            sender: req.user._id, 
            receivers: [notification.sender._id], 
            category: 'message',
            createdOn : new Date() 
        });
        await sendNotification.save();

        req.flash('success',`${sender.username} has been Enrolled in the course: ${course.name}.`)
        res.redirect('/notifications');
    } else {
        notification.isResolved = true;
        await notification.save();

        const sendNotification = new Notification({ 
            description: `Your request for enrolling in ${course.name} by ${receiver.username} has been canceled.`, 
            sender: req.user._id, 
            receivers: [notification.sender._id], 
            category: 'message',
            createdOn : new Date() 
        });
        await sendNotification.save();
        
        req.flash('success',`${sender.username} request has been canceled for the course: ${course.name}.`)
        res.redirect('/notifications');
    }
};