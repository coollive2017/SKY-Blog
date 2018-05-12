const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Article = mongoose.model('Article');

module.exports = (app) => {
  app.use('/admin', router);
};

router.get('/', (req, res, next) => {
  Article.find((err, articles) => {
    if (err) return next(err);
    res.render('admin/index', {
      title: 'Sky-Blog-Admin',
      articles: articles,
      pretty:true
    });
  });
});
