const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const markdown = require('markdown').markdown;
const formidable = require('formidable');
const Article = mongoose.model('Article');
const Category = mongoose.model('Category');
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




