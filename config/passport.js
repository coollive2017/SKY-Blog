const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = mongoose.model('User');

module.exports.init = () => {
	console.log('passport.loacl.init!');
	passport.use(new LocalStrategy({
			usernameField : 'username',
			passwordField : 'password',
			passReqToCallback : true
        },	
		function(req, username, password, done) {
			console.log('passport.loacl.find:',username);
			User.findOne({ username: username }, function (err, user) {
				console.log('passport.loacl.finded:',user, err);
				if (err) {
					return done(err); 
				}
				if (!user) {
					return done(null, false, {error: '该用户不存在！'});
				}
				if (!user.verifyPassword(password)){ 
					return done(null, false, {error: '用户名或者密码有误！'}); 
				}
				return done(null, user);
			});
	  	}
	));

	// passport-session
	passport.serializeUser(function(user, done) {
		console.log('passport.serializeUser.find:', username, err);
	  	done(null, user._id);
	});
	passport.deserializeUser(function(id, done) {
		console.log('passport.deserializeUser.find:',id, err);
		User.findById(_id, function (err, user) {
		done(err, user);
		});
	});
}