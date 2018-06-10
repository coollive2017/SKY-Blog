const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const markdown = require('markdown').markdown;
const formidable = require('formidable');
const transliteration = require('transliteration');
const slug = require('slug');
// models
const Article = mongoose.model('Article');
const Category = mongoose.model('Category');
const User = mongoose.model('User');


module.exports = (app) => {
  app.use('/admin/user/info', router);
};
// 个人信息页
router.get('/', (req, res, next) => {
	console.log('1111');
  return res.render('admin/user/userinfo',{
              title: '个人设置',
              pretty:true
          });
});