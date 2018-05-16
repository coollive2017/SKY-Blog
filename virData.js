/**
 * 生成随机数据
 * */
const lormipsum = require('lorem-ipsum');
const slug = require('slug');
const config = require('./config/config');
const glob = require('glob');
const mongoose = require('mongoose');

mongoose.connect(config.db, {useMongoClient:true});
const db = mongoose.connection;
// const db = mongoose.createConnection(config.db, {useMongoClient:true});

db.on('error', () => {
  throw new Error('unable to connect to database at ' + config.db);
});

const models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});

var Category = mongoose.model('Category');
var User = mongoose.model('User');
var Article = mongoose.model('Article');

User.findOne((err, user) => {
  if(err){
    return console.log('cannot find user!');
    }
  Category.find((err, categories) => {
    if(err){
        return console.log('cannot find category!');
    }
    categories.forEach((category) => {
      // 生成数据数据
      for(var i = 0; i < 60; i++){
        var title = lormipsum({count:1, units: 'sentences'});
        var article = new Article({
          title:title,
          slug:slug(title),
          content:lormipsum({count:50, units: 'sentences'}),
          category: category,
          author: user,
          published: true,
          meta: {
            'favorites':1,
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
          console.log('saved article:' + article.slug);
        });
      }

    });
  });
});


