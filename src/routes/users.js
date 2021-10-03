const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Asignation = require('../models/Asignation');

const passport = require('passport');

router.get('/users/signin', (req, res)=>{
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local',{
    successRedirect:'/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req, res)=>{
    res.render('users/signup');
});

router.post('/users/signup', async (req, res)=>{
    const {name, email, password, confirm_password, code} = req.body;
    const errors = [];

    if(password != confirm_password){
        errors.push({text: 'Password do not match'});
    }
    if (password.length < 4){
        errors.push({text: 'Password must be at least 4 characters'});
    }
    if(code.length<24){
        errors.push({text: 'Assigned code do not match'});
    }else{
        const asignation = await Asignation.find({'_id':code});
        if(asignation.length<1){
            errors.push({text: 'Assigned code do not match'});
        }
    }
    const emailUser = await User.findOne({email: email});
    if (emailUser){
        errors.push({text: 'Email is already in use'});
    }
    if (errors.length>0){
        res.render('users/signup',{errors, name, email, password, confirm_password, code});
    } else {
        const newUser = new User({name, email, password,'asignation':code});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg','You are registered');
        res.redirect('/users/signin');
    }
});

router.get('/users/logout',(req, res)=>{
    req.logout();
    res.redirect('/users/signin');
});

module.exports = router;