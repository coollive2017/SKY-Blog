const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const markdown = require('markdown').markdown;
const formidable = require('formidable');
const Article = mongoose.model('Article');
const Category = mongoose.model('Category');
const transliteration = require('transliteration');
const slug = require('slug');
const User = mongoose.model('User');


module.exports = (app) => {
  app.use('/admin/articles', router);
};
// 首页文章
router.get('/', (req, res, next) => {
  // 获取排序参数
  var sortby = req.query.sortby ? req.query.sortby :'created';
  var sortdir = req.query.sortdir ? req.query.sortdir : 'desc';
  
  // 排序的白名单
  var ac_list = ['title' ,'author', 'category', 'created', 'published']
  if(ac_list.indexOf(sortby) === -1){
    sortby = 'created';
  }
  if(['desc', 'asc'].indexOf(sortdir) === -1){
    sortdir = 'desc';
  }
    //排序对象 
  var sortObj = {};
  sortObj[sortby] = sortdir;

  var conditions = {};
  if(req.query.category){
    conditions.category = req.query.category.trim();
  }
  if(req.query.author){
    conditions.author = req.query.author.trim();
  }
  // 操作数据库 
  User.find({}).exec((err, authors) => {
    Article.find(conditions)
            .sort(sortObj)
            .populate('author')
            .populate('category')
            .exec((err, articles) => {
              //articles = articles.slice(0, 50);
              if (err) return next(err);
              //return res.jsonp(articles);

              //simple page
              //单页数据条数，总共页数，数据总条数，
              var pageNum = Math.abs(parseInt(req.query.page || 1, 10));
              //console.log(parseInt(req.query.page || 1, 10));
              var pageSize = 15;
              var dataTotal = articles.length;
              var pageCount = Math.ceil(dataTotal / pageSize);
              // 临界判断
              if( pageNum > pageCount ){
                pageNum = pageCount;
              }
              // 将参数传回前段页面
              return res.render('admin/article/article', {
                title: 'Sky-Blog',
                articles: articles.slice((pageNum - 1) * pageSize, pageNum * pageSize),
                pageNum:pageNum,
                pageSize:pageSize,
                pageCount:pageCount,
                dataTotal:dataTotal,
                authors:authors,
                sortby:sortby,
                sortdir:sortdir,
                filter:{
                  category:req.query.category || '',
                  author:req.query.author || '',
                },  
                pretty:true
              });
          });
  });

});

// 文章添加
router.get('/add', (req, res, next) => {
  //res.jsonp(req.params.id);
  return res.render('admin/article/add_article');
});
router.post('/add', (req, res, next) => {
  //res.jsonp(req.params.id);
  var title = req.body.title.trim();
  var category = req.body.category.trim();
  var content  = req.body.content;
  var reg = /^[A-Za-z0-9]+$/
  var slug;
  if(!reg.test(title)){
    slug = transliteration.transliterate(title);
  }else{
    slug = title;
  }
  console.log(slug);
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

// 编辑
router.get('/edit/:id', (req, res, next) => {
  //res.jsonp(req.params.id);
 
});
router.post('/edit/:id', (req, res, next) => {
  //res.jsonp(req.params.id);
 
});

// 删除
router.post('/delete/:id', (req, res, next) => {
  if(!req.params.id){
    return next(new Error('not find article ID'));
  }
  console.log(req.params.id);
  Article.remove({_id : req.params.id}).exec((err, rowsRemove) => {
    if(err){
      return next(err);
    }
    if(rowsRemove){
      return res.jsonp({
        status:true,
        text:'文章删除成功'
      });
    }else{
      return res.jsonp({
        status:false,
        text:'文章删除成功'    
      });
    }
  })
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




