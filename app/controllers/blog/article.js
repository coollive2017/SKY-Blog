const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const Category = mongoose.model('Category');

module.exports = (app) => {
  app.use('/articles', router);
};
// 首页文章
router.get('/', (req, res, next) => {
  Article.find({'published' : true})
          .sort('created')
          .populate('author')
          .populate('category')
          .exec((err, articles) => {
            articles = articles.slice(0, 50);
            if (err) return next(err);
            //return res.jsonp(articles);

            //simple page
            //单页数据条数，总共页数，数据总条数，
            var pageNum = Math.abs(parseInt(req.query.page || 1, 10));
            //console.log(parseInt(req.query.page || 1, 10));
            var pageSize = 10;
            var dataTotal = articles.length;
            var pageCount = Math.ceil(dataTotal / pageSize);
            // 临界判断
            if( pageNum > pageCount ){
              pageNum = pageCount;
            }
            // 将参数传回前段页面
            res.render('blog/index', {
              title: 'Sky-Blog',
              articles: articles.slice((pageNum - 1) * pageSize, pageNum * pageSize),
              pageNum:pageNum,
              pageSize:pageSize,
              pageCount:pageCount,
              dataTotal:dataTotal,
              pretty:true
            });
        });
});
// 分类文章查看
router.get('/category/:name', (req, res, next) => {
  Category.findOne({ name : req.params.name}).exec((err, category) => {
    console.log(category.name)
    Article.find({'published' : true, 'category' : category})
          .sort('created')
          .populate('author')
          .populate('category')
          .exec((err, articles) => {
            if (err) return next(err);
            //return res.jsonp(articles);

            //simple page
            //单页数据条数，总共页数，数据总条数，
            var pageNum = Math.abs(parseInt(req.query.page || 1, 10));
            //console.log(parseInt(req.query.page || 1, 10));
            var pageSize = 10;
            var dataTotal = articles.length;
            var pageCount = Math.ceil(dataTotal / pageSize);
            // 临界判断
            if( pageNum > pageCount ){
              pageNum = pageCount;
            }
            // 将参数传回前段页面
            res.render('blog/category', {
              title: 'Sky-Blog',
              articles: articles.slice((pageNum - 1) * pageSize, pageNum * pageSize),
              pageNum:pageNum,
              pageSize:pageSize,
              pageCount:pageCount,
              dataTotal:dataTotal,
              category:category.name,
              pretty:true
            });
        });
  });

});

// 查看
router.get('/view/:id', (req, res, next) => {
  //res.jsonp(req.params.id);
  if(!req.params.id){
    return next(new Error('not find article ID'));
  }
  Article.findOne({_id : req.params.id})
          .populate('author')
          .populate('category')
          .exec((err, article) => {
            if (err) return next(err);

            // 将参数传回前段页面
            res.render('blog/view', {
              title: 'Sky-Blog',
              article: article,
              pretty:true
            });
        });    
  // res.render('about', {
  //   title: 'Sky-Blog',
  //   pretty:true
  // });
});

// 评论
router.get('/comment', (req, res, next) => {

});
// 喜欢
router.get('/favourite', (req, res, next) => {

});



