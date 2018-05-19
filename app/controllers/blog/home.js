const express = require('express');
const router = express.Router();


module.exports = (app) => {
  app.use('/', router);
};

router.get('/', (req, res, next) => {
  return res.redirect('/articles')
});


// 关于我们-
router.get('/about', (req, res, next) => {
  return res.render('about', {
    title: 'Sky-Blog',
    pretty:true
  });
});

// 联系我们-
router.get('/contact', (req, res, next) => {
  return res.render('contact', {
    title: 'Sky-Blog',
    pretty:true
  });
});


