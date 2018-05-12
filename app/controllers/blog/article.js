const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Article = mongoose.model('Article');

module.exports = (app) => {
  app.use('/articles', router);
};

router.get('/', (req, res, next) => {
  Article.find().populate('author').populate('category').exec((err, articles) => {
    if (err) return next(err);
    //return res.jsonp(articles);
    res.render('blog/index', {
      title: 'Sky-Blog',
      articles: articles,
      pretty:true
    });
  });
});

// 查看
router.get('/view', (req, res, next) => {
  res.render('about', {
    title: 'Sky-Blog',
    pretty:true
  });
});

// 评论
router.get('/comment', (req, res, next) => {

});
// 喜欢
router.get('/favourite', (req, res, next) => {

});



