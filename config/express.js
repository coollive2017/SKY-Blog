const express = require('express');
const glob = require('glob');
const favicon = require('serve-favicon');
const logger = require('morgan');
const moment = require('moment');
const truncate = require('truncate');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const messages = require('express-messages');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');;
const markdown = require('markdown').markdown;
const MongoStore = require('connect-mongo')(session);


// models
const Category = mongoose.model('Category');
const User = mongoose.model('User');

module.exports = (app, config, connection) => {
  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === 'development';

  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');

  app.use((req, res, next) => {
    app.locals.path = req.path;
    app.locals.moment = moment;
    app.locals.truncate = truncate;
    app.locals.markdown = markdown;
    //console.log('app.locals.path: ' + app.locals.path );
    Category.find((err, categories) => {
      if(err) return next(err);
        app.locals.categories = categories;
      next();
    });
  });

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(session({
    secret: 'Sky-Blog', 
    resave: false, 
    saveUninitialized: true,
    cookie:{ secure:false },
    store: new MongoStore({ mongooseConnection: connection }),
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    req.user = null;
    if(req.session.passport && req.session.passport.user){
      User.findById(req.session.passport.user, (err, user)=>{
        if(err) return next(err);
        user.password = null;
        req.user = user;
        next();
      });
    }else{
      return next();
    }
  });

  app.use(flash());
  // 用户数据 
  app.use((req, res, next) => {
    app.locals.messages = messages(res, req);
    app.locals.user = req.user;
    next();
  });

  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  var controllers = glob.sync(config.root + '/app/controllers/**/*.js');
  controllers.forEach((controller) => {
    require(controller)(app);
  });

  app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
      console.log(err.status);
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
      title: 'error'
    });
  });

  return app;
};
