const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const transliteration = require('transliteration');
const slug = require('slug');
// models
const User = mongoose.model('User');


module.exports = (app) => {
	app.use('/user/register', router);
};
// Login
router.get('/', (req, res, next) => {
	return res.render('user/register',{
		title: 'Login',
        pretty:true
	});
});
router.post('/', (req, res, next) => {

});