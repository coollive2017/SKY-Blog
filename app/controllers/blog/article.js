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
  app.use('/articles', router);
};
// 首页文章
router.get('/', (req, res, next) => {
  Article.find({'published' : true})
          .sort({'created':'desc'})
          .populate('author')
          .populate('category')
          .exec((err, articles) => {
            articles = articles.slice(0, 50);
            if (err) return next(err);
            //return res.jsonp(articles);
            articles.forEach((article) => {
              article.content = clearHtmlTag(markdown.toHTML(article.content.substring(0, 300)));
              // console.log(article.content);
            });
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
            return res.render('blog/index', {
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
    //console.log(category.name)
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
            return res.render('blog/category', {
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
  // id与slug兼容
  var conditions = compatibilitySlugID(req.params.id);
  Article.findOne(conditions)
          .populate('author')
          .populate('category')
          .exec((err, article) => {
            if (err) return next(err);

            // 将参数传回前段页面
            return res.render('blog/view', {
              title: 'Sky-Blog: '+ article.title,
              article: article,
              pretty:true
            });
        });
});

// article-do-favorite-点赞
router.get('/view/favorite/:id', (req, res, next) => {
  //res.jsonp(req.params.id);
  if(!req.params.id){
    return next(new Error('not find article ID'));
  }
  // id与slug兼容
  var conditions = compatibilitySlugID(req.params.id);

  Article.findOne(conditions)
          .populate('author')
          .populate('category')
          .exec((err, article) => {
            //console.log(article.meta.favorites)
            if (err) return next(err);
            article.meta.favorites = article.meta.favorites ? article.meta.favorites+1 : 1;
            article.markModified('meta');
            article.save();
            // 将参数传回前段页面
            return res.jsonp({
              'status':true,
              'nowFavorites':article.meta.favorites
            });
        });
});
// collect喜欢-收藏
router.post('/view/collect', (req, res, next) => {
  if(!req.body.id){
    return next(new Error('not find article ID'));
  }
  // id与slug兼容
  var conditions = compatibilitySlugID(req.body.id);

  Article.findOne(conditions)
          .exec((err, article) => {
            //console.log(article.meta.collect);
            if(err) {
              return next(err);
            }
            // add collect
            article.meta.collect.count = article.meta.collect.count ? article.meta.collect.count+1 : 1;
            // add user collect info
            var flag = 0;
            article.meta.collect.user.forEach((user) => {
              //console.log(user)
              if(user === req.body.username){
                flag = 1;
              }
            });
            if(!flag){
              article.meta.collect.user.push(req.body.username);
              article.markModified('meta');
              article.save();
              // 将参数传回前段页面
              return res.jsonp({
                'status':true,
                'nowCount':article.meta.collect.count
              });
            }else{
              return res.jsonp({
                'status':false,
                'nowCount':article.meta.collect.count
              });
            }

        });
});

// 评论
router.post('/view/comment/:id', (req, res, next) => {
  console.log(req.params.id);
  if(!req.params.id){
    return next(new Error('not find article ID'));
  }
  // id与slug兼容
  var conditions = compatibilitySlugID(req.params.id);

  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fiedls, files) {

    if(err){
      return console.log(err);
    }
    Article.findOne(conditions)
          .exec((err, article) => {
            //console.log(article.meta.favorites)
            if (err) return next(err);
            var comment = {
              "username":fiedls.username,
              "avatar":fiedls.avatar || 'default',
              "commen_time":new Date(),
              "content": fiedls.editortext,
            }
            article.comments.push(comment);
            article.markModified('comments');
            article.save(function (err, article) {
              if(err) {
                return console.log(err);
              }
              // console.log(article);
              res.redirect('../'+ article._id);
            });
            return ;
            // 将参数传回前段页面
            // return res.render('view'){
            //   title: 'Sky-Blog: '+ article.title,
            //   article: article,
            //   pretty:true
            // });
        });
  }); 
});

// 添加文章
router.get('/add', (req, res, next) => {
  res.render('blog/add_article');
});
router.post('/add', (req, res, next) => {
  //res.jsonp(req.params.id);
  var title = req.body.title.trim();
  var category = req.body.category.trim();
  var content  = req.body.content;
  var reg = /^[A-Za-z0-9]+$/
  var slug;
  if(!reg.test(title)){
    slug = transliteration.transliterate(title).replace(/\s+/g,'');
  }else{
    slug = title;
  }
  User.findOne({}).exec((err, user)=>{
    console.log(user);
    var article = new Article({
      title:title,
      slug:slug,
      content:content,
      category: category,
      author: user,
      published: true,
      meta: {
        'favorites':0,
        'collect':{
          'count':0,
          'user':[]  
        }  
      },
      comments: [],
      created: new Date(),
    });
    // 保存数据
    article.save((err, result) => {
      if(err){
        console.log(err);
        return next(err);
      }
      return res.jsonp({
        status:true,
        text:'文章提交成功，并保存成功！'
      });
      //console.log('saved article:' + article.slug);
    });
  });
});

// 公用方法
function compatibilitySlugID (idAndSlug) {
  var conditions = {};
  try {
    conditions._id = mongoose.Types.ObjectId(idAndSlug);
  } catch(e) {
    conditions.slug = idAndSlug;
  }
  return conditions;
}
function clearHtmlTag(str) {
  //去掉所有的html标记
  return str.replace(/<[^>]+>/g,"");
}




