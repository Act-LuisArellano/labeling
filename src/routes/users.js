const express = require('express');
const router = express.Router();

const { PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { ddbClient } = require("../libs/ddbClient.js");

const User = require('../models/User');
const Asignation = require('../models/Asignation');

const passport = require('passport');

router.get('/users/signin', (req, res)=>{
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local',{
    successRedirect:'/notes/1',
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
        // ---------------------AWS SAVE USER------------------------------
        const hoy = new Date();
        hoy.setTime(hoy.getTime());
        const user_params = {
            TableName: "users",
            Item: {
              _id: { S: newUser._id.toString() },
              name: { S: newUser.name },
              email: { S: newUser.email },
              password: { S: newUser.password },
              asignation: { S: newUser.asignation },
              date: {S : hoy.toISOString()},
            },
          };
          
          const run = async () => {
            try {
              const data = await ddbClient.send(new PutItemCommand(user_params));
              return data;
            } catch (err) {
              console.error(err);
            }
          };
        run();
        // ---------------------------------------------------------------------
        req.flash('success_msg','You are registered');
        res.redirect('/users/signin');
    }
});

router.get('/users/logout',(req, res)=>{
    req.logout();
    res.redirect('/users/signin');
});

module.exports = router;