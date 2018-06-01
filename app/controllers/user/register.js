const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const transliteration = require('transliteration');
const slug = require('slug');
const md5 = require('md5');
// models
const User = mongoose.model('User');


module.exports = (app) => {
	app.use('/user/register', router);
};
// Login
router.get('/', (req, res, next) => {
	return res.render('user/register',{
		title: '用户注册',
        pretty:true
	});
});
router.post('/', (req, res, next) => {
	//res.jsonp(req.params.id);
	console.log(req.body);
	var username = req.body.username.trim();
	var password = req.body.password.trim();
	var email = req.body.email.trim();
	// md5加密
	console.log(password);
	password = md5(md5(password)+md5(password).substring(2,8));
	console.log(password);
	var user = new User({
		username:username,
		email:email,
  		password: password,
  		avatar: 'default.jpg',
  		authority:'普通用户',
		created: new Date(),
	});
	// 保存数据
	user.save((err, result) => {
		if(err){
			console.log(err);	
		  	return next(err);
		}
		return res.jsonp({
			status:true,
			text:'用户注册成功！'
		});
	});
});