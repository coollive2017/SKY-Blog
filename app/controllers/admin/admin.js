const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Article = mongoose.model('Article');

module.exports = (app) => {
  app.use('/admin', router);
};

router.get('/', (req, res, next) => {
  return res.redirect('/admin/articles')
});


