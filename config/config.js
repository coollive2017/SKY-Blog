const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'sky-blog'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/skyblog'
  },

  test: {
    root: rootPath,
    app: {
      name: 'sky-blog'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/sky-blog-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'sky-blog'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/sky-blog-production'
  }
};

module.exports = config[env];
