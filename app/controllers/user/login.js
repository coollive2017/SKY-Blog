const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const transliteration = require('transliteration');
const slug = require('slug');
const passport = require('passport');
// models
const User = mongoose.model('User');


module.exports = (app) => {
	app.use('/user/login', router);
};
// Login
router.get('/', (req, res, next) => {
	return res.render('user/login',{
		title: 'Login',
        pretty:true
	});
});

router.post('/',(req, res, next) => {
	passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { 
        	return res.json({
        		status:user,
        		text:info.error,
        	}); 
        }else{
        	return res.json({
        		status:true,
        		text:'登录成功，正在为你跳转！',
        	});
        }
    })(req, res, next);
});
// router.post('/',passport.authenticate(
// 	'local', 
// 	{ failureRedirect: '#' }),
// 	(req, res, next) => {
// 		console.log('login success:',res);
// 		return res.jsonp(req.body);
// });
// Login-out
router.get('/', (req, res, next) => {
	res.redirect('/')
});