

const express = require('express');
const config = require('./config/config');
const glob = require('glob');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;  
mongoose.connect(config.db,{useMongoClient: true,});
const db = mongoose.connection;

//new connet method
// const db = mongoose.createConnection(config.db,{useMongoClient: true,});

// console.log(db);

db.on('error', () => {
  throw new Error('unable to connect to database at ' + config.db);
});

const models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
const app = express();

module.exports = require('./config/express')(app, config);
module.exports = require('./config/passport').init();

app.listen(config.port, () => {
  console.log('Express server listening on port [' + config.port+']');
});

