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
  app.use('/admin/categories', router);
};
// 分类列表
router.get('/', (req, res, next) => {

  // 操作数据库 
  Category.find({})
          .sort({'created':'desc'})
          .exec((err, categories) => {
            //articles = articles.slice(0, 50);
            if (err) {
              console.log(err);
              return next(err);
            }
            //return res.jsonp(articles);

            //simple page
            //单页数据条数，总共页数，数据总条数，
            var pageNum = Math.abs(parseInt(req.query.page || 1, 10));
            //console.log(parseInt(req.query.page || 1, 10));
            var pageSize = 12;
            var dataTotal = categories.length;
            var pageCount = Math.ceil(dataTotal / pageSize);
            // 临界判断
            if( pageNum > pageCount ){
              pageNum = pageCount;
            }
            // 将参数传回前段页面
            return res.render('admin/category/category', {
              title: 'Sky-Blog-categories',
              categories: categories.slice((pageNum - 1) * pageSize, pageNum * pageSize),
              pageNum:pageNum,
              pageSize:pageSize,
              pageCount:pageCount,
              dataTotal:dataTotal, 
              pretty:true
            });
        });
});
// 分类添加
router.get('/add', (req, res, next) => {
  return res.render('admin/category/add_category',{
    category:{'id':''},
    action:'/admin/categories/add',
  });
});
router.post('/add', (req, res, next) => {
  //res.jsonp(req.params.id);
  console.log(req.body.categoryname)
  var name = req.body.categoryname.trim();
  var reg = /^[A-Za-z0-9]+$/
  var slug;
  if(!reg.test(name)){
    slug = transliteration.transliterate(name).replace(/\s+/g,'');
  }else{
    slug = name;
  }
  var category = new Category({
    name:name,
    slug:slug,
    created: new Date(),
  });
  // 保存数据
  category.save((err, result) => {
    if(err){
      return next(err);
    }
    return res.jsonp({
      status:true,
      text:'分类添加成功！'
    });
  });
});
// 分类编辑
router.get('/edit/:id', (req, res, next) => {
  //res.jsonp(req.params.id);
  if(!req.params.id){
    return next(new Error('not find category ID'));
  }
  // 操作数据库 
  Category.findOne({'_id':req.params.id})
          .exec((err, category) => {
            //articles = articles.slice(0, 50);
            if (err) {
              return next(err);
            }
            // 将参数传回前段页面
            console.log(category);
            return res.render('admin/category/add_category',{
              title: 'Sky-Blog-categories',
              category:category,
              action:'/admin/categories/edit/'+category._id,
              pretty:true
            });
        });
});
router.post('/edit/:id', (req, res, next) => {
  //res.jsonp(req.params.id);
  if(!req.params.id){
    return next(new Error('not find category ID'));
  }
  // 操作数据库 
  Category.findOne({'_id':req.params.id})
          .exec((err, category) => {
            //articles = articles.slice(0, 50);
            if (err) {
              return next(err);
            }
            var reg = /^[A-Za-z0-9]+$/
            var slug;
            if(!reg.test(req.body.categoryname)){
              slug = transliteration.transliterate(req.body.categoryname).replace(/\s+/g,'');
            }else{
              slug = req.body.categoryname;
            }
            category.name = req.body.categoryname;
            category.slug = slug;
            // 将参数传回前段页面
            category.save((err, result) => {
              if(err){
                return next(err);
              }
              return res.jsonp({
                status:true,
                text:'分类修改成功！'
              });
            });  
  });
});

router.post('/delete/:id', (req, res, next) => {
  if(!req.params.id){
    return next(new Error('not find category ID'));
  }
  console.log(req.params.id);
  Category.remove({_id : req.params.id}).exec((err, rowsRemove) => {
    if(err){
      return next(err);
    }
    if(rowsRemove){
      return res.jsonp({
        status:true,
        text:'该类删除成功！'
      });
    }else{
      return res.jsonp({
        status:false,
        text:'该类删除失败！'    
      });
    }
  }) 
});
